import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useContextAuth } from '@/database/contexts/AuthContext';
import { getMessagesByChat } from '@/database/services/chatsServices';
import { MessageType } from '@/database/types/types';

export default function ChatContainer({ id }: { id: string }) {
  const { user } = useContextAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = getMessagesByChat(id, setMessages); 

    return () => {
      unsubscribe(); 
    };
  }, [id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="max-w-[1000px] min-h-screen overflow-y-auto m-auto">
      <ul className="flex flex-col gap-3 p-10 pb-[100px]">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`relative flex p-3 max-w-[500px] w-full rounded-lg ${
              msg.idUserSend === user?.idUser ? 'self-end rounded-br-none bg-purple-900 text-white' : 'self-start rounded-bl-none bg-gray-200 text-gray-900 '
            }`}
          >
            <Image
              src={msg.imageUserSend}
              alt="User Icon"
              width={40}
              height={40}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <p className="font-bold break-words">{msg.nameUserSend}:</p>
              <p className="break-all text-sm">{msg.text}</p>
              <span className="text-xs text-gray-300">
                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Date non disponible'}
              </span>
              <br />
            </div>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
}
