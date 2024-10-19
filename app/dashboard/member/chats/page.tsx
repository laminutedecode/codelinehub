"use client";

import { useEffect, useState } from "react";
import { useContextAuth } from "@/database/contexts/AuthContext";
import { database } from "@/database/firebaseConfig";
import { ref, onValue } from "firebase/database";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { ChatType } from "@/database/types/types";

export default function ChatsPage() {
  const { user } = useContextAuth();
  const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(() => {
    const chatsRef = ref(database, "chats");

    if (user?.idUser) {
      const unsubscribe = onValue(chatsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const userChats: ChatType[] = Object.keys(data)
            .filter(
              (chatId) =>
                data[chatId].idUserSend === user.idUser ||
                data[chatId].idUserReciper === user.idUser
            )
            .map((chatId) => {
              const chat = data[chatId];
              const isSender = chat.idUserSend === user.idUser;

              const otherUser = isSender
                ? {
                    name: chat.nameUserReciper,
                    image: chat.imageUserReciper || "/images/default-avatar.png",
                  }
                : {
                    name: chat.nameUserSend,
                    image: chat.imageUserSend || "/images/default-avatar.png",
                  };

              return {
                chatId,
                userSend: chat.idUserSend,
                userReciper: chat.idUserReciper,
                otherUserName: otherUser.name,
                otherUserPhoto: otherUser.image,
                updatedAt: chat.updatedAt,
                createdAt: chat.createdAt || 0,
                status: chat.status, // Ajout du statut ici
                lastMessageSender: chat.lastMessageSender, // Ajouter l'expéditeur du dernier message
              };
            });

          setChats(userChats);
        } else {
          setChats([]);
        }
      });

      return () => unsubscribe();
    }
  }, [user?.idUser]);

  return (
    <div className="text-white">
      <h1 className="mb-2">Tous les Chats ({chats.length})</h1>
      {chats.map((chat) => (
        <div
          key={chat.chatId}
          className="border p-4 rounded text-white flex items-center justify-between mb-4"
        >
          <div>
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-white mb-2">
              <img
                src={chat?.otherUserPhoto}
                alt={`${chat.otherUserName}'s photo`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold">{chat.otherUserName}</h2>
            <span className="text-xs text-gray-300">
              {chat.updatedAt
                ? new Date(chat.updatedAt).toLocaleString()
                : "Date non disponible"}
            </span>
          </div>
          <div className="flex items-center">
            {/* Badge de notification si le dernier message n'est pas de l'utilisateur connecté */}
            {chat.lastMessageSender !== user.idUser && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full mr-2">
                Nouveau message
              </span>
            )}
            <Link
              href={`/dashboard/member/chats/${chat.chatId}`}
              className="inline-flex justify-center items-center w-12 h-12 bg-green-500 hover:bg-green-800 px-3 py-1.5 text-white rounded-md"
            >
              <FaEye />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
