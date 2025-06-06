'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useCredits } from '@/app/hooks/useCredits';
import ImageGrid from '@/app/components/dashboard/ImageGrid';

const ImageGenerationPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { refreshCredits } = useCredits();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('stable-diffusion');
  const [size, setSize] = useState('1024x1024');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('natural');
  const [previousImages, setPreviousImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const imageStyles = [
    { id: 'natural', name: 'Natural', description: 'Realistic and natural looking images' },
    { id: 'artistic', name: 'Artistic', description: 'Creative and artistic interpretation' },
    { id: 'anime', name: 'Anime', description: 'Japanese animation style' },
    { id: 'abstract', name: 'Abstract', description: 'Non-representational and conceptual' },
    { id: 'cinematic', name: 'Cinematic', description: 'Movie-like dramatic scenes' },
    { id: '3d', name: '3D Render', description: 'Three-dimensional rendered graphics' }
  ];

  const models = [
    {
      id: 'stable-diffusion',
      name: 'Stable Diffusion (SDXL)',
      description: 'High-quality AI image generation',
      creditCost: 4,
    },
    // {
    //   id: 'deepfloyd',
    //   name: 'DeepFloyd IF',
    //   description: 'Text-to-image model with better quality',
    //   creditCost: 6,
    // },
  ];

 

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
      return;
    }

    const fetchPreviousImages = async () => {
      try {
        const response = await fetch('/api/images/list');
        const data = await response.json();
        
        if (response.ok) {
          setPreviousImages(data);
        } else {
          toast.error(data.error || 'Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load previous images');
      } finally {
        setLoadingImages(false);
      }
    };

    fetchPreviousImages();
  }, [status, router]);

  const handleGenerate = async () => {
    if (!session) {
      toast.error('Please log in to continue');
      router.push('/auth');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a description for your image');
      return;
    }

    if (isGenerating) {
      toast.error('Please wait for the current generation to complete');
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading('Initializing image generation...', { duration: 120000 }); // Increased timeout to 2 minutes

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 110000); // Abort after 110 seconds

      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          size,
          negativePrompt: negativePrompt.trim(),
          style: selectedStyle
        }),
      });

      clearTimeout(timeoutId);

      // Update loading message to show progress
      toast.loading('Processing your image...', { id: loadingToast });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Image generation failed');
      }

      // Set the immediate preview using base64 data
      setGeneratedImageUrl(result.image.imageData);
      
      // Update loading message for final stage
      toast.loading('Finalizing image...', { id: loadingToast });
      
      // Wait for the final URL and update the preview
      setTimeout(() => {
        setGeneratedImageUrl(result.image.imageUrl);
        toast.dismiss(loadingToast);
        toast.success('Image generated successfully!');
      }, 1000);

      // Refresh credits after successful generation
      await refreshCredits();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      if (error.name === 'AbortError') {
        toast.error('Image generation is taking longer than expected. Please try again.');
      } else {
        toast.error(error.message || 'Failed to generate image. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImageUrl) return;

    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `genioai-generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleRegenerate = () => {
    if (!isGenerating) {
      handleGenerate();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Image Generation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Image Generation</h1>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`px-6 py-2 rounded-lg ${isGenerating
                ? 'bg-purple-600/50 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'} transition-all duration-300`}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Prompt Input */}
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="w-full h-[150px] bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 mb-4 resize-none"
                />
                <textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Negative prompts (optional)..."
                  className="w-full h-[100px] bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 resize-none"
                />
                <div className="flex justify-end text-sm text-gray-400 mt-2">
                  <span>{prompt.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              {/* Style Select */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Image Style</h3>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  {imageStyles.map(style => (
                    <option key={style.id} value={style.id}>
                      {style.name} - {style.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model and Size */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Image Settings</h3>
                <div>
                  <label className="text-sm text-gray-400">Model</label>
                  <div className="space-y-2 mt-2">
                    {models.map(model => (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`p-4 rounded-xl border cursor-pointer ${selectedModel === model.id ? 'border-purple-500' : 'border-white/10'} hover:border-purple-500/50`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="text-white font-semibold text-sm">{model.name}</div>
                            <div className="text-gray-400 text-xs">{model.description}</div>
                          </div>
                         
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="256x256">256x256</option>
                    <option value="512x512">512x512</option>
                    <option value="1024x1024">1024x1024</option>
                    <option value="1024x1792">1024x1792 (Portrait)</option>
                    <option value="1792x1024">1792x1024 (Landscape)</option>
                  </select>
                </div>

               
              </div>
            </div>

            {/* Image Preview */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6 h-[600px] flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-white mb-4">Image Preview</h3>
              {generatedImageUrl ? (
                <>
                  <Image
                    src={generatedImageUrl}
                    alt="Generated"
                    width={512}
                    height={512}
                    className="rounded-lg object-contain max-h-[400px]"
                  />
                  <div className="flex mt-4 space-x-4">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
                    >
                      Download
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition"
                    >
                      Regenerate
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 text-center">Your generated image will appear here</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Previous Generations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Your Previous Generations</h2>
          {loadingImages ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <ImageGrid images={previousImages} />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ImageGenerationPage;
