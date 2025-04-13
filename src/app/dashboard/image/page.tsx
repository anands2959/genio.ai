'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ImageGenerationPage = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');

  // Calculate estimated credits based on image size and style
  const calculateEstimatedCredits = () => {
    const sizeMultiplier = {
      '256x256': 1,
      '512x512': 2,
      '1024x1024': 4,
      '1024x1792': 6,
      '1792x1024': 6
    } as const;
    const styleMultiplier = {
      'realistic': 1.5,
      'artistic': 1.2,
      'anime': 1,
      'digital-art': 1.3,
      'photography': 1.4,
      'sketch': 1
    } as const;
    return Math.round(sizeMultiplier[size as keyof typeof sizeMultiplier] * styleMultiplier[style as keyof typeof styleMultiplier]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a description for your image');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulated image generation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setGeneratedImageUrl('dummy-image-url'); // This would be replaced with actual generated image URL
    } catch (error) {
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
            {/* Input Section */}
            <div className="space-y-6">
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
                  placeholder="Add negative prompts (optional)..."
                  className="w-full h-[100px] bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 resize-none"
                />
                
                <div className="flex justify-end text-sm text-gray-400 mt-2">
                  <span>{prompt.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              {/* Image Settings */}
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Image Settings</h3>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="realistic">Realistic</option>
                    <option value="artistic">Artistic</option>
                    <option value="anime">Anime</option>
                    <option value="digital-art">Digital Art</option>
                    <option value="photography">Photography</option>
                    <option value="sketch">Sketch</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="256x256">256x256</option>
                    <option value="512x512">512x512</option>
                    <option value="1024x1024">1024x1024</option>
                    <option value="1024x1792">1024x1792 (Portrait)</option>
                    <option value="1792x1024">1792x1024 (Landscape)</option>
                  </select>
                </div>

                {/* Credit Usage Section */}
                <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Estimated Credits</div>
                    <div className="text-lg font-semibold text-purple-400">{calculateEstimatedCredits()} credits</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Credits vary based on image size and style
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Image Preview</h3>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg bg-black/30 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <Image src="/file.svg" alt="Download" width={20} height={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-white/10 rounded-xl p-6">
                {generatedImageUrl ? (
                  <div className="w-full space-y-4">
                    <div className="w-full h-[300px] bg-black/30 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <Image
                        src={generatedImageUrl}
                        alt="Generated Image"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300">
                        Download
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white hover:border-purple-500/50 transition-all duration-300">
                        Regenerate
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-4 rounded-full bg-purple-500/20 inline-block">
                      <Image src="/image-icon.svg" alt="Image" width={32} height={32} className='invert'/>
                    </div>
                    <p className="text-gray-400">Your generated image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ImageGenerationPage;