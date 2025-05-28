import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { uploadAudio } from '@/utils/uploadAudio';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_ENDPOINT = 'https://api-inference.huggingface.co/models/stabilityai/stable-audio-open-1.0';

const calculateCreditCost = (text: string, voice: string, emotion: string, speed: string) => {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const baseCredits = Math.ceil(wordCount / 50); // 1 credit per 50 words

  // Voice style multipliers
  const voiceMultiplier = voice === 'natural' ? 1.0 :
    voice === 'professional' ? 1.5 :
    voice === 'casual' ? 1.2 :
    voice === 'news' ? 1.4 : 1.0;

  // Emotion multipliers
  const emotionMultiplier = emotion === 'neutral' ? 1.0 :
    emotion === 'happy' ? 1.2 :
    emotion === 'sad' ? 1.2 :
    emotion === 'excited' ? 1.3 :
    emotion === 'calm' ? 1.1 : 1.0;

  // Speed multipliers
  const speedMultiplier = speed === 'medium' ? 1.0 :
    speed === 'slow' ? 1.2 :
    speed === 'fast' ? 1.1 : 1.0;

  return Math.max(1, Math.round(baseCredits * voiceMultiplier * emotionMultiplier * speedMultiplier));
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', toastType: 'error' }, { status: 401 });
    }

    const { text, voice, emotion, speed } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required', toastType: 'error' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found', toastType: 'error' }, { status: 404 });

    const creditCost = calculateCreditCost(text, voice, emotion, speed);
    if (user.credits < creditCost) {
      return NextResponse.json({ error: 'Insufficient credits', toastType: 'error' }, { status: 402 });
    }

    const response = await fetch(HF_API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          audio_end_in_s: 10.0,
          num_inference_steps: 200,
          negative_prompt: "Low quality",
          num_waveforms_per_prompt: 1
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
          details: errorText,
          toastType: 'info'
        }, { status });
      } else if (status === 404) {
        errorMessage = 'Model not found or initializing. Please try again in a few minutes.';
        return NextResponse.json({ 
          error: errorMessage,
          status: 'initializing',
          retryAfter: 60,
          details: errorText,
          toastType: 'info'
        }, { status });
      } else if (errorText.includes('invalid token')) {
        errorMessage = 'Invalid API key. Please check your configuration.';
        status = 401;
      }

      return NextResponse.json({ 
        error: errorMessage, 
        status: 'error',
        details: errorText,
        toastType: 'error'
      }, { status });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    const base64Audio = `data:audio/wav;base64,${audioBuffer.toString('base64')}`;

    const cloudinaryUrl = await uploadAudio(base64Audio);

    const voiceGeneration = await prisma.voice.create({
      data: {
        userId: user.id,
        prompt: text,
        audioUrl: cloudinaryUrl,
        settings: {
          voice,
          speed,
          emotion
        },
        creditCost
      }
    });

    // Deduct credits
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: creditCost } }
    });

    return NextResponse.json({
      audioUrl: cloudinaryUrl,
      creditCost,
      id: voiceGeneration.id,
      toastType: 'success'
    });

  } catch (error) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice', toastType: 'error' },
      { status: 500 }
    );
  }
}