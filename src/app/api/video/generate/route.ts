import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { uploadVideo } from '@/utils/uploadVideo';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_ENDPOINT = 'https://api-inference.huggingface.co/models/Lightricks/LTX-Video';

const calculateCreditCost = (duration: number, quality: string) => {
  const baseCost = Math.ceil(duration / 5) * 10; // shorter because model only supports few seconds
  const qualityMultiplier = {
    '720p': 1,
    '1080p': 1.5,
    '4k': 2.5,
  }[quality] || 1;

  return Math.ceil(baseCost * qualityMultiplier);
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, duration, quality, style } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!duration || duration < 2 || duration > 4) {
      return NextResponse.json({ error: 'Duration must be between 2 and 4 seconds (model limitation)' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const creditCost = calculateCreditCost(duration, quality);
    if (user.credits < creditCost) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    const response = await fetch(HF_API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_frames: duration * 24,
          height: 512,
          width: 768,
          num_inference_steps: 50,
          guidance_scale: 12.5,
          negative_prompt: "worst quality, inconsistent motion, blurry, jittery, distorted, unrealistic motion",
          fps: 24
        },
        options: {
          wait_for_model: true,
          use_cache: false
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API error:', errorText);
      let status = response.status;
      let errorMessage = 'Hugging Face API Error';
      const retryAfter = response.headers.get('retry-after');

      if (status === 503) {
        errorMessage = 'Model is loading. Please try again shortly.';
        return NextResponse.json({ 
          error: errorMessage, 
          retryAfter: retryAfter ? parseInt(retryAfter) : 30,
          status: 'loading',
          details: errorText 
        }, { status });
      } else if (status === 404) {
        errorMessage = 'Model not found or initializing. Please try again in a few minutes.';
        return NextResponse.json({ 
          error: errorMessage,
          status: 'initializing',
          retryAfter: 60,
          details: errorText 
        }, { status });
      } else if (errorText.includes('invalid token')) {
        errorMessage = 'Invalid API key. Please check your configuration.';
        status = 401;
      }

      return NextResponse.json({ 
        error: errorMessage, 
        status: 'error',
        details: errorText 
      }, { status });
    }

    const videoBuffer = Buffer.from(await response.arrayBuffer());
    const base64Video = `data:video/mp4;base64,${videoBuffer.toString('base64')}`;

    const cloudinaryUrl = await uploadVideo(base64Video);

    const video = await prisma.video.create({
      data: {
        prompt,
        style,
        duration,
        quality,
        videoUrl: cloudinaryUrl,
        userId: user.id,
        status: 'completed',
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - creditCost },
    });

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        videoUrl: cloudinaryUrl,
        creditCost,
      },
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
