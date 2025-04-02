'use client';

import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import ParticleBackground from '../components/ParticleBackground';

const AuthPage = () => {
  const handleSubmit = (data: { email: string; password: string; name?: string }) => {
    // TODO: Implement authentication logic
    console.log('Form submitted:', data);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <AuthForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AuthPage;