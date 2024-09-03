"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on user role
        if (user.role === 'admin') {
          router.push('/dashboard'); // Admin dashboard
        } else if (user.role === 'team_member') {
          router.push('/dashboard'); // Team member dashboard
        }
      } else {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Optionally, you can show a loading spinner or a welcome message here
  return <div>Loading...</div>;
};

export default HomePage;
