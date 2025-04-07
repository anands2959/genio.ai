'use client';

import React from 'react';
import Image from 'next/image';
import ParticleBackground from '../components/ParticleBackground';
import Link from 'next/link';
import Footer from '../components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Image src="/genio-logo.svg" alt="Genio AI Logo" width={40} height={40} className="rounded-lg" />
          <span className="text-2xl font-bold gradient-text">Genio AI</span>
        </div>
        <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Cookie Policy</h1>
        
        <div className="space-y-8 max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">1. What Are Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you
              with a better experience by remembering your preferences, analyzing site usage, and assisting with our marketing efforts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">2. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">2.1 Essential Cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation
                  and access to secure areas of the website.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">2.2 Performance Cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information
                  anonymously.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">2.3 Functionality Cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  These cookies enable the website to remember choices you make (such as your language preference or login details)
                  and provide enhanced features.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">2.4 Marketing Cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many
                  times you see an ad.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">3. How to Control Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability
              of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4 mt-4">
              <li>Browser Settings: You can modify your browser settings to accept or reject cookies</li>
              <li>Private Browsing: Use your browser's private/incognito mode</li>
              <li>Cookie Management Tools: Install browser extensions for enhanced cookie control</li>
              <li>Our Cookie Banner: Use our cookie consent banner to manage your preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">4. Third-Party Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              Some of our pages display content from external providers, such as YouTube, Facebook, and Twitter. To view this
              third-party content, you first have to accept their specific terms and conditions. This includes their cookie
              policies, which we have no control over.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">5. Updates to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision
              date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">6. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about our Cookie Policy, please contact us at:
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
     <Footer/>
    </div>
  );
};

export default CookiePolicy;