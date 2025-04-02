'use client';
import Image from "next/image";
import { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ParticleBackground from './components/ParticleBackground';

const GetStartedButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <button
      onClick={handleGetStarted}
      className="cta-button bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
      style={{animationDelay: '0.4s'}}
    >
      Get Started
    </button>
  );
};

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <ParticleBackground />
      {/* Navigation Bar */}
      <nav className="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/genio-logo.svg" alt="Genio AI Logo" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold gradient-text">Genio AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#stats" className="text-gray-300 hover:text-white transition">Stats</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
            </div>
            {!session && (
              <Link href="/auth" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24 animate-fade-in">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            Genio AI
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
            Your all-in-one AI content generation platform. Create stunning content with the power of artificial intelligence.
          </p>
          <GetStartedButton />
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="container mx-auto px-4 py-16 border-t border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="stat-card p-6">
            <div className="text-4xl font-bold text-purple-500 mb-2">100K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="stat-card p-6">
            <div className="text-4xl font-bold text-pink-500 mb-2">1M+</div>
            <div className="text-gray-400">Content Generated</div>
          </div>
          <div className="stat-card p-6">
            <div className="text-4xl font-bold text-blue-500 mb-2">98%</div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </div>
          <div className="stat-card p-6">
            <div className="text-4xl font-bold text-green-500 mb-2">50+</div>
            <div className="text-gray-400">AI Models</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Text Generation */}
          <div className="feature-card bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl animate-fade-in hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50" style={{animationDelay: '0.2s'}}>
            <div className="feature-icon h-12 w-12 bg-purple-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Text Generation</h3>
            <p className="text-gray-400">Generate high-quality articles, stories, and more with advanced AI technology.</p>
          </div>

          {/* Audio Generation */}
          <div className="feature-card bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl animate-fade-in hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50" style={{animationDelay: '0.4s'}}>
            <div className="feature-icon h-12 w-12 bg-pink-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Voice & Audio</h3>
            <p className="text-gray-400">Create natural-sounding voiceovers and audio content with AI voices.</p>
          </div>

          {/* Video Generation */}
          <div className="feature-card bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl animate-fade-in hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50" style={{animationDelay: '0.6s'}}>
            <div className="feature-icon h-12 w-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Creation</h3>
            <p className="text-gray-400">Transform your ideas into engaging videos with AI-powered editing tools.</p>
          </div>

          {/* Image Generation */}
          <div className="feature-card bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl animate-fade-in hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50" style={{animationDelay: '0.8s'}}>
            <div className="feature-icon h-12 w-12 bg-green-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Image Generation</h3>
            <p className="text-gray-400">Generate stunning images and artwork with state-of-the-art AI models.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="container mx-auto px-4 py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-600"></div>
              <div className="ml-4">
                <h4 className="font-semibold">The Anand</h4>
                <p className="text-sm text-gray-400">Content Creator</p>
              </div>
            </div>
            <p className="text-gray-300">"Genio AI has revolutionized my content creation workflow. The quality and speed are unmatched!"</p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-pink-600"></div>
              <div className="ml-4">
                <h4 className="font-semibold">Ayush Awasthi</h4>
                <p className="text-sm text-gray-400">Digital Artist</p>
              </div>
            </div>
            <p className="text-gray-300">"The image generation capabilities are mind-blowing. It's like having a professional artist at your fingertips."</p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-600"></div>
              <div className="ml-4">
                <h4 className="font-semibold">Shubham Awasthi</h4>
                <p className="text-sm text-gray-400">Marketing Manager</p>
              </div>
            </div>
            <p className="text-gray-300">"From copywriting to video creation, Genio AI has become an essential tool for our marketing team."</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-4 py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-gray-400">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 50 AI Generations</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic Templates</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Community Support</li>
            </ul>
            <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition">Get Started</button>
          </div>
          <div className="bg-gradient-to-b from-purple-600 to-pink-600 p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300 border border-white/10 shadow-lg shadow-purple-500/20">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <div className="text-4xl font-bold mb-4">$20<span className="text-lg text-gray-200">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center"><span className="text-white mr-2">✓</span> Unlimited Generations</li>
              <li className="flex items-center"><span className="text-white mr-2">✓</span> Premium Templates</li>
              <li className="flex items-center"><span className="text-white mr-2">✓</span> Priority Support</li>
              <li className="flex items-center"><span className="text-white mr-2">✓</span> API Access</li>
            </ul>
            <button className="w-full bg-white text-purple-600 py-2 rounded-lg transition hover:bg-gray-100">Get Started</button>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
            <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
            <div className="text-4xl font-bold mb-4">Custom</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Custom Solutions</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Dedicated Support</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> SLA Agreement</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Custom Integration</li>
            </ul>
            <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition">Contact Sales</button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 animate-fade-in" style={{animationDelay: '0.4s'}}>
        <div className="gradient-bg rounded-2xl p-8 md:p-12 text-center animate-float">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-xl text-gray-200 mb-8">Join thousands of creators using Genio AI to bring their ideas to life.</p>
          <button className="cta-button bg-white text-purple-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
            Start Creating Now
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Image src="/genio-logo.svg" alt="Genio AI Logo" width={50} height={50} className="rounded-lg" />
                <span className="text-3xl font-bold gradient-text">Genio AI</span>
              </div>
              <p className="text-gray-400">Empowering creativity through artificial intelligence.</p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition">Testimonials</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition">Terms & Conditions</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://twitter.com/genioai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="https://github.com/genioai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                </a>
                <a href="https://linkedin.com/company/genioai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Genio AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
