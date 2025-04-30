'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

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
    if (!title.trim()) {
      toast.error('Please enter a blog title');
      return;
    }

    if (!topicDescription.trim()) {
      toast.error('Please describe your blog topic');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          topicDescription,
          tone,
          length
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setContent(data.content);
      toast.success('Blog content generated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate content. Please try again.');
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
                  className="w-full h-[150px] bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 mb-4 resize-none"
                />
                
                <div className="flex justify-end text-sm text-gray-400 mt-1 space-x-4">
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
              
              <div className="prose prose-invert max-w-none overflow-y-auto max-h-[calc(100vh-200px)]">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mt-6 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-medium text-white mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="text-gray-300 mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4" {...props} />
                  }}
                >
                  {content || 'Your generated content will appear here...'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default BlogGenerationPage;