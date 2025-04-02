'use client';

import React from 'react';
import Image from 'next/image';
import ParticleBackground from '../components/ParticleBackground';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Image src="/genio-logo.svg" alt="Genio AI Logo" width={32} height={32} className="rounded-lg" />
          <span className="text-xl font-bold gradient-text">Genio AI</span>
        </div>
        <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Privacy Policy</h1>
        
        <div className="space-y-8 max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              At Genio AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our AI content generation platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">2. Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-white">2.1 Personal Information</h3>
              <p className="text-gray-300 leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4">
                <li>Name and email address</li>
                <li>Account credentials</li>
                <li>Payment information</li>
                <li>Content you generate using our platform</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">3. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4 mt-4">
              <li>Providing and maintaining our services</li>
              <li>Processing your transactions</li>
              <li>Sending you technical notices and updates</li>
              <li>Improving our AI models and user experience</li>
              <li>Responding to your requests and support needs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information.
              However, please note that no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">5. Cookies and Tracking</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain information.
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">6. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4 mt-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">7. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">8. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@genioai.com
              <br />
              Address: 123 AI Street, Tech City, TC 12345
            </p>
          </section>

          <div className="text-gray-400 text-sm mt-8 pt-8 border-t border-gray-700">
            Last Updated: March 2025
          </div>
        </div>
      </div>
      <footer className="relative z-10 border-t border-gray-800 mt-16 py-8 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Image src="/genio-logo.svg" alt="Genio AI Logo" width={24} height={24} className="rounded-lg" />
              <span className="text-sm font-medium gradient-text">Genio AI</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">
            © {new Date().getFullYear()} Genio AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;