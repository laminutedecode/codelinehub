"use client"

import { useEffect, useState } from 'react';
import { useContextAuth } from '@/database/contexts/AuthContext';
import { database } from '@/database/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Link from 'next/link';
import { FaEye } from "react-icons/fa";
import { ChatType } from '@/database/types/types';


export default function ChatsPage() {
  const { user } = useContextAuth();
  const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(() => {
    const chatsRef = ref(database, 'chats');

    if (user?.idUser) {
      const unsubscribe = onValue(chatsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const userChats: ChatType[] = Object.keys(data)
            .filter(chatId => 
              data[chatId].userSend === user.idUser || data[chatId].userReciper === user.idUser
            )
            .map(chatId => ({
              chatId,
              userSend: data[chatId].userSend,
              userReciper: data[chatId].userReciper,
              nameUserReciper: data[chatId].nameUserReciper || 'Nom non disponible', 
              nameUserSend: data[chatId].nameUserSend || 'Nom non disponible', 
              userReciperPhoto: data[chatId].imageUserReciper || '/images/default-avatar.png', 
              updatedAt: data[chatId].updatedAt,
            }));

          setChats(userChats);
        } else {
          setChats([]);
        }
      });

      return () => unsubscribe();
    }
  }, [user?.idUser]);

  return (
    <div className='text-white'>
      <h1 className='mb-2'>Tous les Chats ({chats.length})</h1>
      {chats.map((chat) => (
        <div key={chat.chatId} className="border p-4 rounded text-white flex items-center justify-between mb-4">
          <div>
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-white mb-2">
              <img
                src={chat.userReciperPhoto}
                alt={`${chat.nameUserReciper}'s photo`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold ">{chat.nameUserReciper}</h2>
            <span className="text-xs text-gray-300">{chat.updatedAt ? new Date(chat.updatedAt).toLocaleString() : 'Date non disponible'}</span>
          </div>
          <div>
            <Link href={`/dashboard/member/chats/${chat.chatId}`} className="inline-flex justify-center items-center w-12 h-12 bg-green-500 hover:bg-green-800 px-3 py-1.5 text-white rounded-md">
              <FaEye />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
