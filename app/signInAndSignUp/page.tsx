"use client";
import { useContextAuth } from '@/database/contexts/AuthContext';
import Loader from '../components/Loader';
import SignInAndUpForm from '../components/signInAndUp/SignInAndUpForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PageSignInAndUp() {

  const router = useRouter()
 
  const { isFetch, user } = useContextAuth();

  if (isFetch) {
    return <Loader />;
  }

  useEffect(() => {
    
    if (user) {
      router.push('/dashboard/member/profile');
    } else if (user === null) { 
      router.push('/signInAndSignUp');
    }
  }, [user]); 
  

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center justify-center flex-col gap-2">
      <SignInAndUpForm />
      <div className="hidden lg:block h-screen w-full bg-cover" style={{ backgroundImage: `url('/img-login.jpg')` }}></div>
    </section>
  );
}
