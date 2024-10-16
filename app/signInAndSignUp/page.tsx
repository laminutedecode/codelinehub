"use client";
import { useEffect } from 'react';
import { useContextAuth } from '@/database/contexts/AuthContext';
import Loader from '../components/Loader';
import SignInAndUpForm from '../components/signInAndUp/SignInAndUpForm';

export default function PageSignInAndUp() {
 
  const { isFetch, redirectIfAuthenticated, user } = useContextAuth();

  useEffect(() => {
    redirectIfAuthenticated(); 
  }, []); 

  if (isFetch) {
    return <Loader />;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center justify-center flex-col gap-2">
      <SignInAndUpForm />
      <div className="hidden lg:block h-screen w-full bg-cover" style={{ backgroundImage: `url('/img-login.jpg')` }}></div>
    </section>
  );
}
