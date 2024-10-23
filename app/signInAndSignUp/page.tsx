"use client";
import { useContextAuth } from '@/contexts/AuthContext';
import Loader from '../components/Loader';
import SignInAndUpForm from '../components/signInAndUp/SignInAndUpForm';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PageSignInAndUp() {
  const router = useRouter();
  const { isFetch, user } = useContextAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Marquer le composant comme monté
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isFetch) {
      if (user) {
        router.push('/dashboard/member/profile');
      } else {
        router.push('/signInAndSignUp');
      }
    }
  }, [isMounted, isFetch, user, router]);

  if (isFetch) {
    return <Loader />;
  }

  return (
    <section className="max-w-[1000px] mx-auto flex min-h-screen items-center justify-center flex-col gap-2">
      <SignInAndUpForm />
    </section>
  );
}
