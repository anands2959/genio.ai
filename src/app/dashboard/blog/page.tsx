'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';

const BlogGenerationPage = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [topicDescription, setTopicDescription] = useState('');

  // Calculate estimated credits based on content length and tone
  const calculateEstimatedCredits = () => {
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

  const handleGenerate = async () => {
    if (!topicDescription.trim()) {
      alert('Please describe your blog topic first');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulated AI generation based on topic description, tone, and length
      const generatedContent = await new Promise((resolve) => {
        setTimeout(() => {
          const wordCount = length === 'short' ? 300 : length === 'medium' ? 600 : 1000;
          const intro = `Based on your topic: "${topicDescription}", here's a ${tone} blog post:\n\n`;
          const simulatedContent = `This is a ${wordCount}-word ${tone} blog post about ${topicDescription}. The content will be generated using advanced AI algorithms to ensure high quality and relevance to your topic.`;
          resolve(intro + simulatedContent);
        }, 2000);
      });

      setContent(generatedContent);
    } catch (error) {
      alert('Failed to generate content. Please try again.');
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
            <h1 className="text-2xl font-bold text-white">Blog Generation</h1>
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
            {/* Editor Section */}
            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 mb-4"
                />
                <textarea
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  placeholder="Describe your blog topic in detail. What would you like to write about?"
                  className="w-full h-[300px] bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 mb-4 resize-none"
                />
                
                <div className="flex justify-end text-sm text-gray-400 mt-2 space-x-4">
                  {/* <span>{topicDescription.length} characters</span> */}
                  <span>{topicDescription.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              {/* Generation Settings */}
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Generation Settings</h3>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Length</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="short">Short (~300 words)</option>
                    <option value="medium">Medium (~600 words)</option>
                    <option value="long">Long (~1000 words)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Credit Usage Section */}
                <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Estimated Credits</div>
                    <div className="text-lg font-semibold text-purple-400">{calculateEstimatedCredits()} credits</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Credits vary based on content length and tone
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg bg-black/30 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <Image src="/content-icon.svg" alt="Copy" width={20} height={20} className='invert'/>
                  </button>
                  <button className="p-2 rounded-lg bg-black/30 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <Image src="/download.svg" alt="Download" width={20} height={20} className='invert' />
                  </button>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                {title && <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>}
                <div className="text-gray-300 whitespace-pre-wrap">
                  {content || 'Your generated content will appear here...'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default BlogGenerationPage;