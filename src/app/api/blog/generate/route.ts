import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY! });

const calculateCreditCost = (length: string, tone: string) => {
  const lengthMultiplier: Record<string, number> = {
    'short': 5,
    'medium': 10,
    'long': 15,
    'custom': 20
  };
  const toneMultiplier: Record<string, number> = {
    'professional': 1.2,
    'casual': 1,
    'formal': 1.3,
    'friendly': 1.1
  };
  return Math.round(lengthMultiplier[length] * toneMultiplier[tone]);
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', toastType: 'error' }, { status: 401 });
    }

    const { title, topicDescription, tone, length } = await req.json();

    if (!title?.trim() || !topicDescription?.trim()) {
      return NextResponse.json({ error: 'Title and topic description are required', toastType: 'error' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found', toastType: 'error' }, { status: 404 });

    const creditCost = calculateCreditCost(length, tone);
    if (user.credits < creditCost) {
      return NextResponse.json({ error: 'Insufficient credits', toastType: 'error' }, { status: 402 });
    }

    // Initialize the model and generate content
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: [{
        role: 'user',
        parts: [{ text: `Write a ${length} blog post about ${title}. Here are more details about the topic: ${topicDescription}. 
The tone should be ${tone}.

Please format the blog post in markdown with appropriate headings, paragraphs, and emphasis where needed. Make it engaging and well-structured.` }]
      }]
    });
    const content = result.text;

    // Save to database and deduct credits
    await prisma.$transaction([
      prisma.blog.create({
        data: {
          title,
          content,
          userId: user.id,
          category: 'general'
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: creditCost } }
      })
    ]);

    return NextResponse.json({ 
      content,
      toastType: 'success'
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate blog content',
      toastType: 'error'
    }, { status: 500 });
  }
}