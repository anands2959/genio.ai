'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const VoiceGenerationPage = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [voice, setVoice] = useState('natural');
  const [emotion, setEmotion] = useState('neutral');
  const [speed, setSpeed] = useState('medium');
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState('');

 
  const handleGenerate = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          emotion,
          speed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate voice');
      }

      setGeneratedAudioUrl(data.audioUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate voice. Please try again.');
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
                    <AudioPlayer
                      src={generatedAudioUrl}
                      autoPlay={false}
                      showJumpControls={false}
                      customProgressBarSection={[
                        'CURRENT_TIME',
                        'PROGRESS_BAR',
                        'DURATION',
                      ]}
                      customControlsSection={[
                        'MAIN_CONTROLS',
                        'VOLUME_CONTROLS',
                      ]}
                      className="bg-black/30 rounded-lg"
                    />
                    <div className="flex justify-center">
                      <a
                        href={generatedAudioUrl}
                        download
                        className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white hover:border-purple-500/50 transition-all duration-300"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-4 rounded-full bg-purple-500/20 inline-block">
                      <Image src="/voice-icon.svg" alt="Voice" width={32} height={32} className='invert' />
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