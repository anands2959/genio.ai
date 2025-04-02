'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';

const VoiceGenerationPage = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [voice, setVoice] = useState('natural');
  const [emotion, setEmotion] = useState('neutral');
  const [speed, setSpeed] = useState('medium');
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState('');

  // Calculate estimated credits based on text length, voice style, emotion and speed
  const calculateEstimatedCredits = () => {
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
      speed === 'fast' ? 1.3 : 1.0;

    // Calculate total credits with all multipliers
    const totalCredits = Math.max(1, Math.round(baseCredits * voiceMultiplier * emotionMultiplier * speedMultiplier));
    return totalCredits;
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulated voice generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setGeneratedAudioUrl('dummy-audio-url'); // This would be replaced with actual generated audio URL
    } catch (error) {
      alert('Failed to generate voice. Please try again.');
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
            <h1 className="text-2xl font-bold text-white">Voice Generation</h1>
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
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  className="w-full h-[200px] bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 mb-4 resize-none"
                />
                
                <div className="flex justify-end text-sm text-gray-400 mt-2">
                  <span>{text.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              {/* Voice Settings */}
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Voice Settings</h3>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Voice Style</label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="natural">Natural</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="news">News Anchor</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Emotion</label>
                  <select
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="excited">Excited</option>
                    <option value="calm">Calm</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Speaking Speed</label>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="slow">Slow</option>
                    <option value="medium">Medium</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>

                {/* Credit Usage Section */}
                <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Estimated Credits</div>
                    <div className="text-lg font-semibold text-purple-400">{calculateEstimatedCredits()} credits</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Credits vary based on text length, voice style, emotion and speed
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Audio Preview</h3>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg bg-black/30 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <Image src="/file.svg" alt="Download" width={20} height={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-white/10 rounded-xl p-6">
                {generatedAudioUrl ? (
                  <div className="w-full space-y-4">
                    <div className="w-full h-12 bg-black/30 rounded-lg flex items-center justify-center">
                      <span className="text-white">Audio Player Placeholder</span>
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
                      <Image src="/voice-icon.svg" alt="Voice" width={32} height={32} />
                    </div>
                    <p className="text-gray-400">Your generated audio will appear here</p>
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

export default VoiceGenerationPage;