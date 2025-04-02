'use client';

import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';

const BillingPage = () => {
  // Sample data - in a real app, this would come from your backend
  const freeCredits = 1000;
  const usedCredits = 750;
  const serviceUsage = [
    {
      service: 'Image Generation',
      icon: '/image-icon.svg',
      used: 300,
      description: 'Generate high-quality images with AI',
      creditsPerUse: '1-6 credits per image',
    },
    {
      service: 'Blog Generation',
      icon: '/content-icon.svg',
      used: 200,
      description: 'Create engaging blog content',
      creditsPerUse: '5-20 credits per article',
    },
    {
      service: 'Voice Generation',
      icon: '/voice-icon.svg',
      used: 150,
      description: 'Convert text to natural speech',
      creditsPerUse: '1-4 credits per generation',
    },
    {
      service: 'Video Generation',
      icon: '/video-icon.svg',
      used: 100,
      description: 'Create AI-powered videos',
      creditsPerUse: '10-30 credits per video',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Credits & Usage</h1>
          </div>

          {/* Credits Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Free Credits Overview</h2>
                <button className="px-6 py-2 text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 border border-white/10">
                  Upgrade Now
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-400">Credits Used</span>
                  <span className="text-white font-medium">{usedCredits}/{freeCredits}</span>
                </div>
                <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                    style={{ width: `${(usedCredits / freeCredits) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  You have {freeCredits - usedCredits} credits remaining in your free plan
                </p>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Free Plan Benefits</h2>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400">✓</span>
                  </div>
                  <span>{freeCredits} free credits monthly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400">✓</span>
                  </div>
                  <span>Access to all AI services</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400">✓</span>
                  </div>
                  <span>Standard generation quality</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400">✓</span>
                  </div>
                  <span>Basic support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Upgrade Plans */}
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Upgrade to Premium</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pro Plan */}
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4 hover:border-purple-500/50 transition-all duration-300">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">Pro</h3>
                  <div className="text-3xl font-bold text-white">$29<span className="text-lg text-gray-400">/mo</span></div>
                  <p className="text-sm text-gray-400">Perfect for professionals</p>
                </div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>5,000 credits monthly</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>Priority generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>Email support</span>
                  </li>
                </ul>
                <button className="w-full px-4 py-2 mt-4 text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 border border-white/10">
                  Get Pro
                </button>
              </div>

              {/* Business Plan */}
              <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 space-y-4 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full">
                  Popular
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">Business</h3>
                  <div className="text-3xl font-bold text-white">$99<span className="text-lg text-gray-400">/mo</span></div>
                  <p className="text-sm text-gray-400">For growing businesses</p>
                </div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>20,000 credits monthly</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>Ultra HD quality</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>Priority support</span>
                  </li>
                </ul>
                <button className="w-full px-4 py-2 mt-4 text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 border border-white/10">
                  Get Business
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4 hover:border-purple-500/50 transition-all duration-300">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">Enterprise</h3>
                  <div className="text-3xl font-bold text-white">Custom</div>
                  <p className="text-sm text-gray-400">For large organizations</p>
                </div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>Unlimited credits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>Custom features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span>24/7 support</span>
                  </li>
                </ul>
                <button className="w-full px-4 py-2 mt-4 text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 border border-white/10">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          {/* Service Usage */}
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Service Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceUsage.map((service, index) => (
                <div
                  key={index}
                  className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-purple-500/20">
                      <Image src={service.icon} alt={service.service} width={24} height={24} className="invert" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{service.service}</h3>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Credits Used</span>
                      <span className="text-white">{service.used}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                        style={{ width: `${(service.used / usedCredits) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{service.creditsPerUse}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;