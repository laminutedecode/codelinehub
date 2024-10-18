"use client";
import { IoSend } from "react-icons/io5";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { database } from '@/database/firebaseConfig'; 
import { useContextAuth } from '@/database/contexts/AuthContext';
import { ref, set, serverTimestamp, get, child, query, orderByChild, equalTo } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '@/database/firebaseConfig'; 
import { UserTypeData } from "@/database/types/types";

export default function SendMessage({ id }: { id: string }) {
  const { user } = useContextAuth();
  const [value, setValue] = useState("");
  const [recipientInfo, setRecipientInfo] = useState<UserTypeData | null>(null); 
  const [userSendInfo, setUserSendInfo] = useState<UserTypeData | null>(null); 

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const fetchRecipientInfo = async () => {
    const recipientDocRef = doc(db, 'members', id); 
    const recipientDoc = await getDoc(recipientDocRef);
    
    if (recipientDoc.exists()) {
      setRecipientInfo(recipientDoc.data() as UserTypeData);
    } else {
      console.error("Aucun utilisateur trouvé pour cet ID");
    }
  };

  const fetchUserSendInfo = async () => {
    const userSendDocRef = doc(db, 'members', user?.idUser as string); 
    const userSendDoc = await getDoc(userSendDocRef);
    
    if (userSendDoc.exists()) {
      setUserSendInfo(userSendDoc.data() as UserTypeData);
    } else {
      console.error("Aucun utilisateur trouvé pour cet ID");
    }
  };

  useEffect(() => {
    fetchRecipientInfo(); 
    fetchUserSendInfo(); 
  }, [id, user?.idUser]); // Ajout de user?.idUser comme dépendance

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (value.trim() && user && recipientInfo) {
        const messageData = {
            text: value,
            nameUserSend: `${userSendInfo?.firstName} ${userSendInfo?.lastName}` || userSendInfo?.email,
            nameUserReciper: `${recipientInfo?.firstName} ${recipientInfo?.lastName}` || recipientInfo?.email,
            idUserSend: userSendInfo?.idUser,
            idUserReciper: recipientInfo?.idUser,
            imageUserSend: userSendInfo?.image || '/images/default-avatar.png',
            imageUserReciper: recipientInfo?.image || '/images/default-avatar.png',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // Référence à la conversation
        const chatRef = ref(database, `chats/${recipientInfo.idUser}`);

        // Vérifie si la conversation existe déjà
        const chatSnapshot = await get(child(chatRef, 'messages'));

        if (chatSnapshot.exists()) {
            // Si la conversation existe, ajoute le message
            const messageRef = ref(database, `chats/${recipientInfo.idUser}/messages/${Date.now()}`);
            await set(messageRef, messageData);
        } else {
            // Sinon, crée une nouvelle conversation avec le message
            const newChatData = {
                userSend: userSendInfo?.idUser,
                userReciper: recipientInfo?.idUser,
                imageUserSend: userSendInfo?.image || '/images/default-avatar.png',
                imageUserReciper: recipientInfo?.image || '/images/default-avatar.png',
                nameUserSend: `${userSendInfo?.firstName} ${userSendInfo?.lastName}` || userSendInfo?.email,
                nameUserReciper: `${recipientInfo?.firstName} ${recipientInfo?.lastName}` || recipientInfo?.email,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                messages: {
                    [Date.now()]: messageData,
                }
            };
            await set(chatRef, newChatData);
        }

        setValue("");
    }
};


  return (
    <form onSubmit={handleSubmit} className="bg-purple-900 fixed left-0 bottom-0 w-full py-10 flex items-center justify-center px-3 flex-col">
      <div className="w-full flex items-center justify-center px-3">
        <input 
          value={value} 
          onChange={handleChange} 
          placeholder="Votre message..." 
          type="text" 
          className="p-3 w-full outline-none border-none rounded-l-md" 
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-3 flex items-center gap-2 border-none rounded-r-md">
          <IoSend />
          <span>Envoyer</span>
        </button>
      </div>
    </form>
  );
}
