import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { title, description, category } = data;

    // Initialize Google's Gemini Pro model with the latest API version
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    // Create a professional prompt for blog generation
    const prompt = `Write a professional and engaging blog post with the following details:

Title: ${title}
Topic: ${description}
Category: ${category}

Please ensure the content is:
- Well-structured with clear paragraphs
- Engaging and informative
- Professional in tone
- SEO-friendly
- Between 500-800 words`;
    
    let generatedContent;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      generatedContent = response.text();
      
      if (!generatedContent) {
        throw new Error('Empty response from AI model');
      }
    } catch (modelError) {
      console.error('AI model error:', modelError);
      return NextResponse.json(
        { error: 'Failed to generate blog content' },
        { status: 500 }
      );
    }

    // Save the generated blog to database
    const blog = await prisma.blog.create({
      data: {
        title,
        content: generatedContent,
        category,
        userId: session.user.email,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Blog generated successfully',
      blog: {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        category: blog.category,
        status: blog.status,
        createdAt: blog.createdAt,
      },
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog' },
      { status: 500 }
    );
  }
}