"use client";

import { useContextAuth } from "@/contexts/AuthContext";
import { database } from "@/database/firebaseConfig";
import { ChatType } from "@/types/types";
import { onValue, ref, update } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

export default function ChatsPage() {
  const { user } = useContextAuth();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [showArchived, setShowArchived] = useState<boolean>(false);

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
                status: chat.status,
                lastMessageSender: chat.lastMessageSender,
                archived: chat.archived || false,
                nameUserSend: chat.nameUserSend || "",
                nameUserReciper: chat.nameUserReciper || "", 
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

  const toggleArchived = (chatId: string, shouldArchive: boolean) => {
    const chatRef = ref(database, `chats/${chatId}`);
    update(chatRef, {
      archived: shouldArchive,
    });
  };


  const filteredChats = showArchived
    ? chats.filter((chat) => chat.archived)
    : chats.filter((chat) => !chat.archived);

  // Compteur total de messages non archivés
  const totalMessagesCount = chats.filter((chat) => !chat.archived).length;

  // Compteur de messages archivés
  const archivedMessagesCount = chats.filter((chat) => chat.archived).length;

  return (
    <div className="text-white">
      <div className="flex mb-4">
        <button
          onClick={() => setShowArchived(false)}
          className={`mr-4 px-4 py-2 rounded text-sm ${
            !showArchived ? "bg-purple-500" : "text-white"
          }`}
        >
          Tous les Messages ({totalMessagesCount}) {/* Compteur pour Tous les Messages */}
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`px-4 py-2 rounded text-sm ${
            showArchived ? "bg-purple-500" : "text-white"
          }`}
        >
          Messages Archivés ({archivedMessagesCount}) {/* Compteur pour Messages Archivés */}
        </button>
      </div>
      {filteredChats.map((chat) => (
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
            {chat.lastMessageSender !== user?.idUser && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full mr-2">
                Nouveau message
              </span>
            )}
            <Link
              href={`/dashboard/member/chats/${chat.chatId}`}
              className="ml-4 px-2 py-2 bg-purple-500 hover:bg-purple-800 text-white rounded"
            >
              <FaEye />
            </Link>
            {!chat.archived ? (
              <button
                onClick={() => toggleArchived(chat.chatId, true)}
                className="ml-4 px-2 py-1 bg-purple-500 hover:bg-purple-800 text-white rounded"
              >
                Archiver
              </button>
            ) : (
              <button
                onClick={() => toggleArchived(chat.chatId, false)}
                className="ml-4 px-2 py-1 bg-purple-500 hover:bg-purple-800 text-white rounded"
              >
                Désarchiver
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
