import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '@/database/firebaseConfig'; 
import { UserTypeData } from "@/database/types/types";

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
