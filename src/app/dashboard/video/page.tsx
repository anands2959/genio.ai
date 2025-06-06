'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const VideoGenerationPage = () => {
  const { data: session } = useSession();
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState('cinematic');
  const [duration, setDuration] = useState('2');
  const [resolution, setResolution] = useState('1080p');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [ratio, setRatio] = useState('16:9');
  // Remove service state as it's not needed

  // Calculate estimated credits based on duration and resolution
  const calculateEstimatedCredits = () => {
    const styleMultiplier = {
      'cinematic': 2,
      'documentary': 1.5,
      'commercial': 1.8,
      'social': 1.3
    } as const;

    const resolutionMultiplier = {
      '720p': 1,
      '1080p': 1.5,
      '4k': 2.5
    } as const;

    const durationInSeconds = parseInt(duration);
    const baseCost = Math.ceil(durationInSeconds / 5) * 10; // Match backend calculation
    
    return Math.max(1, Math.round(baseCost * 
      styleMultiplier[style as keyof typeof styleMultiplier] * 
      resolutionMultiplier[resolution as keyof typeof resolutionMultiplier]));
  };

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script or description for your video');
      return;
    }

    if (!session?.user?.email) {
      toast.error('Please sign in to generate videos');
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading('Generating your video...');

    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: script,
          style,
          duration: parseInt(duration),
          quality: resolution
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setGeneratedVideoUrl(data.videoUrl);
      // setRemainingCredits(data.remainingCredits);
      toast.success('Video generated successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Video generation error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate video',
        { id: loadingToast }
      );
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
            <h1 className="text-2xl font-bold text-white">Video Generation</h1>
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
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Describe your video or enter a script..."
                  className="w-full h-[200px] bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 mb-4 resize-none"
                />
                
                <div className="flex justify-end text-sm text-gray-400 mt-2">
                  <span>{script.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              {/* Video Settings */}
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Video Settings</h3>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="cinematic">Cinematic</option>
                    <option value="documentary">Documentary</option>
                    <option value="commercial">Commercial</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Duration (seconds)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="2">2 seconds</option>
                    <option value="3">3 seconds</option>
                    <option value="4">4 seconds</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="4k">4K Ultra HD</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Aspect Ratio</label>
                  <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Vertical)</option>
                    <option value="4:3">4:3 (Traditional)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="2k">2K QHD</option>
                    <option value="4k">4K Ultra HD</option>
                  </select>
                </div>
               </div>
            </div>

            {/* Preview Section */}
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Video Preview</h3>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg bg-black/30 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <Image src="/file.svg" alt="Download" width={20} height={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-white/10 rounded-xl p-6">
                {generatedVideoUrl ? (
                  <div className="w-full space-y-4">
                    <div className="w-full h-48 bg-black/30 rounded-lg flex items-center justify-center">
                      <span className="text-white">Video Player Placeholder</span>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300">
                        Play
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white hover:border-purple-500/50 transition-all duration-300">
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-4 rounded-full bg-purple-500/20 inline-block">
                      <Image src="/video-icon.svg" alt="Video" width={32} height={32} className='invert' />
                    </div>
                    <p className="text-gray-400">Your generated video will appear here</p>
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

export default VideoGenerationPage;