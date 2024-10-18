"use client"
import { useEffect, useState } from 'react';
import ChatContainer from '@/app/components/chats/ChatContainer';
import SendMessage from '@/app/components/chats/SendMessage';
import { useContextAuth } from '@/database/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const { user, isFetch } = useContextAuth();
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); 

  useEffect(() => {
    if (!isFetch) {
      setLoading(false);
    }
  }, [isFetch]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  console.log(id);
  

  return (
    <div className="w-full min-h-screen">
      <ChatContainer  id={id as string}/>
      <SendMessage id={id as string} />
    </div>
  );
}
