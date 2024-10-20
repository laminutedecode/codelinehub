import { database } from '@/database/firebaseConfig';
import { ChatType, MessageType, UserTypeData } from '@/types/types';
import { get, onValue, ref, serverTimestamp, set, update } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '@/database/firebaseConfig'; 

export const fetchRecipientInfo = async (recipientId: string): Promise<UserTypeData | null> => {
    const recipientDocRef = doc(db, 'members', recipientId.split('-')[1]); // Récupère l'ID du destinataire
    const recipientDoc = await getDoc(recipientDocRef);
    
    if (recipientDoc.exists()) {
        return recipientDoc.data() as UserTypeData;
    } else {
        console.error("Aucun utilisateur trouvé pour cet ID");
        return null;
    }
};

export const fetchUserSendInfo = async (userId: string): Promise<UserTypeData | null> => {
    const userSendDocRef = doc(db, 'members', userId);
    const userSendDoc = await getDoc(userSendDocRef);
    
    if (userSendDoc.exists()) {
        return userSendDoc.data() as UserTypeData;
    } else {
        console.error("Aucun utilisateur trouvé pour cet ID");
        return null;
    }
};


export const getUserChats = (userId: string, setChats: (chats: ChatType[]) => void) => {
  const chatsRef = ref(database, "chats");

  const unsubscribe = onValue(chatsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const userChats: ChatType[] = Object.keys(data)
        .filter(
          (chatId) =>
            data[chatId].idUserSend === userId ||
            data[chatId].idUserReciper === userId
        )
        .map((chatId) => {
          const chat = data[chatId];
          const isSender = chat.idUserSend === userId;

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
            lastMessageSender: chat.lastMessageSender || '', 
            archived: chat.archived || false, 
            nameUserSend: chat.nameUserSend || '', 
            nameUserReciper: chat.nameUserReciper || '',
          };
        });

      setChats(userChats);
    } else {
      setChats([]);
    }
  });

  return unsubscribe; 
};

export const getMessagesByChat = (chatId: string, setMessages: (messages: MessageType[]) => void) => {
  const messagesRef = ref(database, `chats/${chatId}/messages`);
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const messagesData = snapshot.val() || {};
    const messagesList: MessageType[] = Object.keys(messagesData).map((key) => ({
      id: key,
      ...messagesData[key],
      createdAt: messagesData[key].createdAt || null,
      updatedAt: messagesData[key].updatedAt || null,
      status: messagesData[key].status || 'Nouveau',
    }));

    messagesList.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    setMessages(messagesList);
  });
  return unsubscribe; 
};




export const sendMessage = async (id: string, userSendInfo: UserTypeData | null, recipientInfo: UserTypeData | null, messageText: string) => {
  if (!id || !userSendInfo || !recipientInfo || !messageText) {
    throw new Error("Missing required information.");
  }

  const messageData = {
    text: messageText,
    nameUserSend: `${userSendInfo.firstName} ${userSendInfo.lastName}` || userSendInfo.email,
    nameUserReciper: `${recipientInfo.firstName} ${recipientInfo.lastName}` || recipientInfo.email,
    idUserSend: userSendInfo.idUser,
    idUserReciper: recipientInfo.idUser,
    imageUserSend: userSendInfo.image || '/images/default-avatar.png',
    imageUserReciper: recipientInfo.image || '/images/default-avatar.png',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const chatData = {
    idUserSend: userSendInfo.idUser,
    idUserReciper: recipientInfo.idUser,
    nameUserSend: `${userSendInfo.firstName} ${userSendInfo.lastName}` || userSendInfo.email,
    nameUserReciper: `${recipientInfo.firstName} ${recipientInfo.lastName}` || recipientInfo.email,
    imageUserSend: userSendInfo.image || '/images/default-avatar.png',
    imageUserReciper: recipientInfo.image || '/images/default-avatar.png',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "Nouveau",
    lastMessageSender: userSendInfo.idUser,
  };

  const chatRef = ref(database, `chats/${id}`);
  const chatSnapshot = await get(chatRef);

  // Création ou mise à jour du chat
  if (!chatSnapshot.exists()) {
    await set(chatRef, chatData);
  } else {
    await update(chatRef, {
      updatedAt: serverTimestamp(),
      lastMessageSender: userSendInfo.idUser,
    });
  }

  // Enregistrement du message
  const messageRef = ref(database, `chats/${id}/messages/${Date.now()}`);
  await set(messageRef, messageData);
};
