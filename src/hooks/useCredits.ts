'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export const useCredits = () => {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch('/api/user/credits');
      const data = await response.json();
      if (data.credits !== undefined) {
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [session]);

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  return { credits, loading, updateCredits, fetchCredits };
};