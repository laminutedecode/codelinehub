"use client";

import { useEffect, useState } from 'react';
import ChatContainer from '@/app/components/chats/ChatContainer';
import SendMessage from '@/app/components/chats/SendMessage';
import { useContextAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { database } from '@/database/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';

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

  useEffect(() => {
    if (id && user) {
      const chatRef = ref(database, `chats/${id}`);
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const chatData = snapshot.val();

        if (chatData) {
          const messages = chatData.messages || {};
          const lastMessage = Object.values(messages).pop();

    
          update(chatRef, { status: 'Lu' })
           
        }
      });

      return () => unsubscribe(); 
    }
  }, [id, user]);

  return (
    <div className="w-full min-h-screen">
      {id && (
        <>
          <ChatContainer id={id as string} /> 
          <SendMessage id={id as string} /> 
        </>
      )}
    </div>
  );
}
