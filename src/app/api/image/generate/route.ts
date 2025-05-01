import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { HfInference } from '@huggingface/inference';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/utils/uploadImage';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, size, negativePrompt, style } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get user and check credits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate credit cost based on image size
    const [width, height] = size.split('x').map(Number);
    const creditCost = Math.ceil((width * height) / (512 * 512) * 10); // Base cost of 10 credits for 512x512

    if (user.credits < creditCost) {
      return NextResponse.json({ 
        error: 'Insufficient credits', 
        required: creditCost, 
        available: user.credits 
      }, { status: 402 });
    }

    // Enhance the prompt based on the selected style
    const stylePrompts = {
      natural: 'realistic, high-quality, photorealistic',
      artistic: 'artistic, creative, stylized',
      anime: 'anime style, manga-inspired',
      abstract: 'abstract, non-representational, conceptual',
      cinematic: 'cinematic, dramatic lighting, movie scene',
      '3d': '3D rendered, volumetric lighting, octane render'
    };

    const enhancedPrompt = `${prompt}, ${stylePrompts[style as keyof typeof stylePrompts]}`;

    // Set timeout for the API request
    const timeout = 120000; // 2 minutes timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Generate image using Stable Diffusion with retry mechanism
    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await hf.textToImage({
          inputs: enhancedPrompt,
          model: 'stabilityai/stable-diffusion-xl-base-1.0',
          parameters: {
            negative_prompt: negativePrompt || 'blurry, bad quality, distorted',
            width: width,
            height: height,
            num_inference_steps: 50,
            guidance_scale: 7.5
          }
        }, { signal: controller.signal });
        break; // If successful, exit the retry loop
      } catch (error: any) {
        retries--;
        if (retries === 0) throw error;
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, (3 - retries) * 5000));
      }
    }
    
    clearTimeout(timeoutId);

    if (!response) {
      throw new Error('Failed to generate image');
    }

    // Convert the blob to base64
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const imageData = `data:image/jpeg;base64,${base64}`;

    // Upload image to Cloudinary
    const imageUrl = await uploadImage(imageData);

    // Deduct credits from user
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: creditCost } }
    });

    // Save image information to database
    const image = await prisma.image.create({
      data: {
        prompt,
        style,
        imageUrl,
        userId: user.id,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Image generated successfully',
      image: {
        id: image.id,
        prompt: image.prompt,
        style: image.style,
        imageUrl: image.imageUrl,
        imageData: imageData, // Include base64 data for immediate preview
        createdAt: image.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}