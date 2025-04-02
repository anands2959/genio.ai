'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const DashboardPage = () => {
  // Mock data for previous generations
  const previousGenerations = [
    { id: 1, type: 'content', title: 'Blog Post About AI', date: '2024-01-15', preview: 'Artificial Intelligence is transforming...', status: 'completed' },
    { id: 2, type: 'image', title: 'Futuristic City', date: '2024-01-14', preview: '/content-icon.svg', status: 'completed' },
    { id: 3, type: 'video', title: 'Product Demo', date: '2024-01-13', preview: '/video-icon.svg', status: 'processing' },
    { id: 4, type: 'voice', title: 'Podcast Intro', date: '2024-01-12', preview: '/voice-icon.svg', status: 'completed' },
  ];

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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Generations', value: '1,234', change: '+12%' },
            { label: 'Success Rate', value: '98.5%', change: '+2.1%' },
            { label: 'API Credits', value: '8,540', change: '-120' },
            { label: 'Response Time', value: '1.2s', change: '-0.3s' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-xl hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              <div className="mt-2 flex items-baseline">
                <div className="text-2xl font-semibold text-white">{stat.value}</div>
                <div className={`ml-2 text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Previous Generations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Recent Generations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {previousGenerations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-xl hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4 ">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Image src={item.type === 'content' ? '/content-icon.svg' : item.preview} alt={item.type} width={24} height={24} className="text-white invert" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {item.type === 'content' ? item.preview : `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Generation`}
                </p>
                <div className="text-xs text-gray-500">{new Date(item.date).toISOString().split('T')[0]}</div>
              </motion.div>
            ))}
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