'use client';

import React from 'react';
import Image from 'next/image';
import ParticleBackground from '../components/ParticleBackground';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Image src="/genio-logo.svg" alt="Genio AI Logo" width={32} height={32} className="rounded-lg" />
          <span className="text-xl font-bold gradient-text">Genio AI</span>
        </div>
        <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Terms and Conditions</h1>
        
        <div className="space-y-8 max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using Genio AI's services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">2. Service Description</h2>
            <p className="text-gray-300 leading-relaxed">
              Genio AI provides AI-powered content generation and analysis services. Our services are subject to change or termination at our discretion.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4 mt-4">
              <li>Content generation capabilities</li>
              <li>AI-powered analysis</li>
              <li>User account management</li>
              <li>Subscription services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">3. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed">
              Users of Genio AI agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4 mt-4">
              <li>Provide accurate account information</li>
              <li>Maintain the security of their account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not misuse or abuse the service</li>
              <li>Not infringe on others' intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">4. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content, features, and functionality of Genio AI are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">5. Subscription and Payments</h2>
            <p className="text-gray-300 leading-relaxed">
              Some features of Genio AI require a paid subscription. By subscribing to our services, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4 mt-4">
              <li>Pay all applicable fees</li>
              <li>Provide accurate billing information</li>
              <li>Accept our refund and cancellation policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">6. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              Genio AI provides its services "as is" without any warranty. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">7. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to terminate or suspend access to our services immediately, without prior notice or liability, for any reason whatsoever.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">8. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">9. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms and Conditions, please contact us at:
              <br />
              Email: legal@genioai.com
              <br />
              Address: 123 AI Street, Tech City, TC 12345
            </p>
          </section>

          <div className="text-gray-400 text-sm mt-8 pt-8 border-t border-gray-700">
            Last Updated: March 2025
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;