'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UseCreditsReturn {
  credits: number | null;
  loading: boolean;
  error: string | null;
  refreshCredits: () => Promise<void>;
}

export const useCredits = (): UseCreditsReturn => {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/user/credits');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch credits');
      }

      setCredits(data.credits);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credits');
      setCredits(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshCredits = async () => {
    setLoading(true);
    await fetchCredits();
  };

  useEffect(() => {
    if (session) {
      fetchCredits();
    } else {
      setCredits(null);
      setLoading(false);
    }
  }, [session]);

  return { credits, loading, error, refreshCredits };
};