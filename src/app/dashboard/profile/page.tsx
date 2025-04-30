'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const ProfileSettings = () => {
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '/user-icon.svg',
    notifications: {
      email: true,
      push: false,
      marketing: true
    }
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || '/user-icon.svg'
      }));
    }
  }, [session]);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          avatar: formData.avatar
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      setSuccessMessage('Profile updated successfully!');
      
      // Update the session with new user data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: result.user.name,
          image: result.user.image
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      formData.name,
      formData.email,
      formData.avatar !== '/genio-logo.svg'
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-center space-x-2 mb-8">
        <Image src="/genio-logo.svg" alt="Genio AI Logo" width={40} height={40} className="rounded-lg" />
        <span className="text-2xl font-bold gradient-text">Genio AI</span>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleAvatarClick}>
                  <Image
                    src={formData.avatar}
                    alt="Profile Avatar"
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow-lg transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Profile Picture</h3>
                <p className="text-gray-400 text-sm">Click to upload a new avatar</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Saving Changes...' : 'Save Changes'}
                </button>
                {successMessage && (
                  <p className="mt-2 text-sm text-green-400 text-center">{successMessage}</p>
                )}
              </div>
            </form>
          </div>

        </div>

        <div className="space-y-6">

          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Account Security</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-all duration-300 flex justify-between items-center">
                <span>Change Password</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {/* <button className="w-full text-left px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-all duration-300 flex justify-between items-center">
                <span>Two-Factor Authentication</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;