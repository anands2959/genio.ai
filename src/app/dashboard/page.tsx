'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const DashboardPage = () => {
  const { data: session } = useSession();
  const [previousGenerations, setPreviousGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const [blogs, images, videos, voices] = await Promise.all([
          fetch('/api/blogs/list').then(res => res.json()),
          fetch('/api/images/list').then(res => res.json()),
          fetch('/api/videos/list').then(res => res.json()),
          fetch('/api/voices/list').then(res => res.json())
        ]);

        const allGenerations = [
          ...blogs.map(blog => ({
            id: blog.id,
            type: 'content',
            title: blog.title,
            date: new Date(blog.createdAt).toLocaleDateString(),
            preview: blog.content.substring(0, 50) + '...',
            status: blog.status
          })),
          ...images.map(image => ({
            id: image.id,
            type: 'image',
            title: image.prompt.substring(0, 30),
            date: new Date(image.createdAt).toLocaleDateString(),
            preview: image.imageUrl,
            status: 'completed'
          })),
          ...videos.map(video => ({
            id: video.id,
            type: 'video',
            title: video.prompt.substring(0, 30),
            date: new Date(video.createdAt).toLocaleDateString(),
            preview: video.videoUrl,
            status: video.status
          })),
          ...voices.map(voice => ({
            id: voice.id,
            type: 'voice',
            title: voice.text.substring(0, 30),
            date: new Date(voice.createdAt).toLocaleDateString(),
            preview: voice.audioUrl,
            status: 'completed'
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setPreviousGenerations(allGenerations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching generations:', error);
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchGenerations();
    }
  }, [session]);

  // Feature cards data
  const features = [
    { id: 'content', title: 'Blog Generation', description: 'Create engaging blog posts, articles, and more', icon: '/content-icon.svg', href: '/dashboard/blog' },
    { id: 'video', title: 'Video Generation', description: 'Generate stunning videos with AI', icon: '/video-icon.svg', href: '/dashboard/video' },
    { id: 'voice', title: 'Voice Generation', description: 'Convert text to natural-sounding speech', icon: '/voice-icon.svg', href: '/dashboard/voice' },
    { id: 'image', title: 'Image Generation', description: 'Create unique images and artwork', icon: '/image-icon.svg', href: '/dashboard/image' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Recent Generations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Recent Generations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <div key={index} className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-xl animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/20 w-10 h-10"></div>
                    <div className="w-20 h-6 bg-gray-700/50 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-700/50 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded mb-4"></div>
                  <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
                </div>
              ))
            ) : previousGenerations.length === 0 ? (
              // Empty state
              <div className="col-span-4 text-center py-12">
                <div className="p-4 rounded-full bg-purple-500/20 w-fit mx-auto mb-4">
                  <Image src="/content-icon.svg" alt="No generations" width={32} height={32} className="text-white invert" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No generations yet</h3>
                <p className="text-sm text-gray-400">Start creating amazing content with our AI tools!</p>
              </div>
            ) : (
              // Generation cards
              previousGenerations.slice(0, 4).map((generation) => (
              <motion.div
                key={generation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20 w-fit">
                    <Image
                      src={`/${generation.type}-icon.svg`}
                      alt={generation.type}
                      width={20}
                      height={20}
                      className="text-white invert"
                    />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${generation.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {generation.status}
                  </span>
                </div>
                <h3 className="text-md font-semibold text-white mb-2 truncate">{generation.title}</h3>
                <p className="text-sm text-gray-400 mb-4 truncate">{generation.preview}</p>
                <p className="text-xs text-gray-500">{generation.date}</p>
              </motion.div>
            )))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Generate Something Amazing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.id} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-xl hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-purple-500/20 w-fit mb-4">
                    <Image src={feature.icon} alt={feature.title} width={24} height={24} className="text-white invert" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;