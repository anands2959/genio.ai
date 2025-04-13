import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face inference with your API token
if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('HUGGINGFACE_API_KEY is not configured');
  throw new Error('API key not configured. Please set up your Hugging Face API key in your environment variables.');
}

// Validate API key format
if (!process.env.HUGGINGFACE_API_KEY.startsWith('hf_')) {
  console.error('Invalid Hugging Face API key format');
  throw new Error('Invalid API key format. API key should start with "hf_". Please check your Hugging Face API key.');
}

// Initialize with API token and additional options
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY, {
  wait_for_model: true,
  use_cache: true,
  retry_on_error: true,
  timeout: 30000 // 30 seconds timeout
});

// Use more reliable open-source models
const PRIMARY_MODEL = 'facebook/opt-350m';
const FALLBACK_MODEL = 'EleutherAI/gpt-neo-125M';

export async function POST(req: NextRequest) {
  try {
    const { title, topicDescription, tone, length } = await req.json();

    // Input validation
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Construct the prompt based on available inputs
    const wordCount = length === 'short' ? 300 : length === 'medium' ? 600 : 1000;
    let prompt;
    
    if (topicDescription) {
      // Enhanced prompt when both title and description are available
      prompt = `Write a ${tone || 'professional'} blog post with the following structure:

Title: "${title}"

Topic: ${topicDescription}

Requirements:
1. Create a well-structured blog post of approximately ${wordCount} words
2. Include an engaging introduction that hooks the reader
3. Break down the content into 3-4 main sections with clear headings
4. Under each section, include:
   - Well-organized paragraphs
   - Relevant bullet points or key takeaways
   - Supporting examples or evidence
5. End with a strong conclusion that summarizes the main points
6. Use appropriate subheadings to improve readability
7. Maintain a ${tone || 'professional'} tone throughout

Format the blog post with proper Markdown formatting:
- Use # for main title
- Use ## for section headings
- Use ### for subheadings
- Use bullet points (-) for lists
- Use paragraphs for main content

Blog Post:`;
    } else {
      // Basic prompt with just the title
      prompt = `Write a ${tone || 'professional'} blog post with the following structure:

Title: "${title}"

Requirements:
1. Create a well-structured blog post of approximately ${wordCount} words
2. Include an engaging introduction that hooks the reader
3. Break down the content into 3-4 main sections with clear headings
4. Under each section, include:
   - Well-organized paragraphs
   - Relevant bullet points or key takeaways
   - Supporting examples or evidence
5. End with a strong conclusion that summarizes the main points
6. Use appropriate subheadings to improve readability
7. Maintain a ${tone || 'professional'} tone throughout

Format the blog post with proper Markdown formatting:
- Use # for main title
- Use ## for section headings
- Use ### for subheadings
- Use bullet points (-) for lists
- Use paragraphs for main content

Blog Post:`;    
    }

    // API key validation already done during initialization

    // Generate text with primary model, with improved error handling
    let response;
    try {
      response = await hf.textGeneration({
        model: PRIMARY_MODEL,
        inputs: prompt,
        parameters: {
          max_new_tokens: Math.min(wordCount * 2, 500),
          temperature: 0.8,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        }
      });
    } catch (modelError: any) {
      console.error('Primary model failed:', modelError);
      
      // Check for specific error types
      if (modelError.message?.includes('authentication') || modelError.message?.includes('unauthorized')) {
        console.error('Authentication error details:', modelError.message);
        throw new Error('Authentication failed. Please verify your Hugging Face API key and ensure you have the necessary model access permissions.');
      }
      
      try {
        // Fallback to a smaller model with reduced parameters
        response = await hf.textGeneration({
          model: FALLBACK_MODEL,
          inputs: prompt,
          parameters: {
            max_new_tokens: Math.min(wordCount * 1.5, 400),
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        });
      } catch (fallbackError: any) {
        console.error('Fallback model failed:', fallbackError);
        if (fallbackError.message?.includes('authentication') || fallbackError.message?.includes('unauthorized')) {
          console.error('Fallback authentication error details:', fallbackError.message);
          throw new Error('API authentication failed. Please ensure your Hugging Face API key is valid and you have permissions to access the models.');
        }
        throw new Error('Content generation failed. Please try again later or contact support.');
      }
    }

    // Extract and clean the generated text
    const generatedContent = response.generated_text.trim();

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Blog generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate blog content';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}