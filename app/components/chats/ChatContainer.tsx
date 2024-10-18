import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { database } from '@/database/firebaseConfig';
import { useContextAuth } from '@/database/contexts/AuthContext';
import { ref, onValue, off } from 'firebase/database';
import { MessageType } from '@/database/types/types';

export default function ChatContainer({ id }: { id: string }) {
  const { user } = useContextAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const messagesRef = ref(database, `chats/${id}/messages`);

    // S'abonner aux messages
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val() || {};
      const messagesList: MessageType[] = Object.keys(messagesData).map((key) => ({
        id: key,
        ...messagesData[key],
        createdAt: messagesData[key].createdAt,
        updatedAt: messagesData[key].updatedAt,
      }));

      // Trier les messages du plus ancien au plus récent
      messagesList.sort((a, b) => a.createdAt - b.createdAt);

      setMessages(messagesList);
    });

    // Fonction de nettoyage pour désabonner
    return () => {
      off(messagesRef); // Désabonnez-vous des mises à jour
    };
  }, [id]);

  // Utiliser useEffect pour faire défiler vers le bas lorsque les messages changent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="max-w-[1000px] min-h-screen overflow-y-auto m-auto">
      <ul className="flex flex-col gap-3 p-10 pb-[150px]">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`relative flex p-3 max-w-xs rounded-lg bg-opacity-50 ${
              msg.idUserSend === user?.idUser ? 'self-end rounded-br-none bg-purple-900 text-white' : 'self-start rounded-bl-none bg-gray-300 text-gray-900'
            }`}
          >
            <Image src={msg.imageUserSend} alt="User Icon" width={40} height={40} className="w-12 h-12 rounded-full mr-3" />
            <div>
              <p className="font-bold break-words">{msg.nameUserSend}:</p>
              <p className='break-all text-sm'>{msg.text}</p>
              <span className="text-xs text-gray-300">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Date non disponible'}</span>
            </div>
          </li>
        ))}
        {/* Div pour défiler vers le bas */}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
}
