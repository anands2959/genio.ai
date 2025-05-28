'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AudioGenerationPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('en-US-1');
  const [speed, setSpeed] = useState('1.0');
  const [emotion, setEmotion] = useState('neutral');

  const voices = [
    { id: 'en-US-1', name: 'English (US) - Female', description: 'Clear and professional female voice' },
    { id: 'en-US-2', name: 'English (US) - Male', description: 'Deep and engaging male voice' },
    { id: 'en-GB-1', name: 'English (UK) - Female', description: 'Refined British female accent' },
    { id: 'en-GB-2', name: 'English (UK) - Male', description: 'Sophisticated British male accent' },
  ];

  const emotions = [
    { id: 'neutral', name: 'Neutral', description: 'Balanced and natural tone' },
    { id: 'happy', name: 'Happy', description: 'Cheerful and upbeat expression' },
    { id: 'sad', name: 'Sad', description: 'Melancholic and gentle tone' },
    { id: 'excited', name: 'Excited', description: 'Energetic and enthusiastic delivery' },
  ];

  const calculateEstimatedCredits = () => {
    const baseCredits = Math.ceil(text.length / 100); // 1 credit per 100 characters
    const emotionMultiplier = emotion === 'neutral' ? 1 : 1.5;
    return Math.max(1, Math.round(baseCredits * emotionMultiplier));
  };

  const handleGenerate = async () => {
    if (!session) {
      toast.error('Please log in to continue', {
        duration: 3000,
        position: 'top-center',
      });
      router.push('/auth');
      return;
    }

    if (!text.trim()) {
      toast.error('Please enter some text to generate audio', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    if (isGenerating) {
      toast.error('Please wait for the current generation to complete', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading('Generating your audio...', {
      position: 'top-center',
    });

    try {
      const response = await fetch('/api/audio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          speed: parseFloat(speed),
          emotion,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToast);
        if (result.toastType === 'info') {
          toast.custom(
            (t) => (
              <div className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg">
                <p>{result.error}</p>
                {result.retryAfter && (
                  <p className="text-sm mt-2">Retry in {result.retryAfter} seconds</p>
                )}
              </div>
            ),
            { duration: result.retryAfter ? result.retryAfter * 1000 : 5000, position: 'top-center' }
          );
        } else {
          toast.error(result.error || 'Failed to generate audio', {
            duration: 5000,
            position: 'top-center',
          });
        }
        throw new Error(result.error || 'Audio generation failed');
      }

      setGeneratedAudioUrl(result.audioUrl);
      toast.dismiss(loadingToast);
      toast.success('Audio generated successfully!', {
        duration: 3000,
        position: 'top-center',
        icon: '🎵',
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      if (!error.message.includes('Audio generation failed')) {
        toast.error(error.message || 'An unexpected error occurred', {
          duration: 5000,
          position: 'top-center',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedAudioUrl) return;

    try {
      const response = await fetch(generatedAudioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download audio');
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
            <h1 className="text-2xl font-bold text-white">Audio Generation</h1>
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
              {/* Text Input */}
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  className="w-full h-[200px] bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 resize-none"
                />
                <div className="flex justify-end text-sm text-gray-400 mt-2">
                  <span>{text.length} characters</span>
                </div>
              </div>

              {/* Voice Settings */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Voice Settings</h3>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Voice</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  >
                    {voices.map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} - {voice.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Emotion</label>
                  <select
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  >
                    {emotions.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Speed</label>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="0.5">0.5x (Slow)</option>
                    <option value="0.75">0.75x (Relaxed)</option>
                    <option value="1.0">1.0x (Normal)</option>
                    <option value="1.25">1.25x (Fast)</option>
                    <option value="1.5">1.5x (Very Fast)</option>
                  </select>
                </div>

                <div className="mt-4 p-4 border border-purple-500/20 rounded-lg bg-purple-500/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Credits</span>
                    <span className="text-purple-400 font-semibold">{calculateEstimatedCredits()} credits</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Based on text length and voice settings</div>
                </div>
              </div>
            </div>

            {/* Audio Preview */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6 h-[600px] flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-4">Audio Preview</h3>
              {generatedAudioUrl ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <audio
                    controls
                    src={generatedAudioUrl}
                    className="w-full max-w-md"
                  />
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all duration-300"
                  >
                    Download Audio
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-center">
                  Your generated audio will appear here
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AudioGenerationPage;