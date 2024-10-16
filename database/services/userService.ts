import { doc, getDoc, updateDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { db } from "@/database/firebaseConfig";
import { UserTypeData } from "@/database/types/types";

export const getUserInfos = async (userId: string): Promise<UserTypeData | null> => {
  try {
    const userDoc = doc(db, "members", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserTypeData;
    } else {
      redirect('/dashboard/profile');
    }
  } catch (err) {
    redirect('/dashboard/profile');
  }
};

export const updateUserInfo = async (userId: string, updatedInfo: Partial<UserTypeData>) => {
  try {
    const userDoc = doc(db, "members", userId);
    await updateDoc(userDoc, {
      ...updatedInfo,
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour des données:", err);
    throw new Error("Erreur lors de la mise à jour des données.");
  }
};
