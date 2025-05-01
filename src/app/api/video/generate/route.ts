import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { uploadVideo } from '@/utils/uploadVideo';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, model, duration, style } = await req.json();

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

    // Calculate credit cost based on video duration
    const creditCost = Math.ceil(duration * 20); // 20 credits per second of video

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

    // Generate video using Hugging Face's Text-to-Video model
    const response = await hf.textToVideo({
      inputs: enhancedPrompt,
      model: 'damo-vilab/text-to-video-ms-1.7b',
      parameters: {
        num_inference_steps: 50,
        guidance_scale: 7.5,
        num_frames: duration * 30, // 30 fps
      }
    });

    if (!response) {
      throw new Error('Failed to generate video');
    }

    // Convert the blob to base64
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const videoData = `data:video/mp4;base64,${base64}`;

    // Upload video to Cloudinary
    const videoUrl = await uploadVideo(videoData);

    // Deduct credits from user
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - creditCost }
    });

    // Save video information to database
    const video = await prisma.video.create({
      data: {
        prompt,
        style,
        videoUrl,
        userId: session.user.email,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Video generated successfully',
      video: {
        id: video.id,
        prompt: video.prompt,
        style: video.style,
        videoUrl: video.videoUrl,
        createdAt: video.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}