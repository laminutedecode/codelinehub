"use client";

import { useEffect, useState } from 'react';
import ChatContainer from '@/app/components/chats/ChatContainer';
import SendMessage from '@/app/components/chats/SendMessage';
import { useContextAuth } from '@/database/contexts/AuthContext';
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

      // Écoute les données du chat
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const chatData = snapshot.val();

        if (chatData) {
          // Récupérer le dernier message
          const messages = chatData.messages || {};
          const lastMessage = Object.values(messages).pop(); // Dernier message

          // Mettre à jour le statut en "Lu" lors de l'accès à la page
          update(chatRef, { status: 'Lu' })
            .then(() => {
              console.log('Statut mis à jour en "Lu"');
            })
            .catch((error) => {
              console.error('Erreur lors de la mise à jour du statut:', error);
            });
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
