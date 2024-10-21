import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";
import { db } from "@/database/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useContextAuth } from "@/contexts/AuthContext";

type ActionType = "like" | "follow";

interface ButtonActionProps {
  idUserProfile: string;
  action: ActionType;
}

export default function ButtonsActions({ idUserProfile, action }: ButtonActionProps) {
  const { user } = useContextAuth();
  const idUserCurrent = user?.idUser;
  const [check, setCheck] = useState<boolean>(false);

  const fetchInitialState = async () => {
    const userRef = doc(db, `members/${idUserProfile}`);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.data();
      const actionUsers = action === "like" ? userData.usersLike : userData.usersFollow;
      const hasActioned = actionUsers?.includes(idUserCurrent);
      setCheck(hasActioned || false); 
    }
  };

  useEffect(() => {
    if (idUserCurrent) {
      fetchInitialState();
    }
  }, [idUserCurrent]);

  const handleToggle = async () => {
    const userRef = doc(db, `members/${idUserProfile}`);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.data();

      let newCount: number;
      let newUsers: string[];

      if (action === "like") {
        newCount = userData.nbLikeProfile || 0;
        newUsers = userData.usersLike || [];
      } else { // action === "follow"
        newCount = userData.nbFollowProfil || 0;
        newUsers = userData.usersFollow || [];
      }

      const hasActioned = newUsers.includes(idUserCurrent as string);

      if (hasActioned) {
        newCount -= 1;
        newUsers = newUsers.filter((userId: string) => userId !== idUserCurrent);
      } else {
        newCount += 1;
        newUsers.push(idUserCurrent as string);
      }

      setCheck(!hasActioned); // Met à jour l'état local du bouton

      await updateDoc(userRef, {
        ...(action === "like" ? { nbLikeProfile: newCount, usersLike: newUsers } : { nbFollowProfil: newCount, usersFollow: newUsers }),
      });
    }
  };

  return (
    <button
      title={action === "like" ? "Like" : "Follow"}
      name={action === "like" ? "Like" : "Follow"}
      type="button"
      onClick={handleToggle}
      className={`flex items-center gap-2 hover:bg-red-800 px-3 py-1.5 text-white my-3 rounded-md text-sm ${check ? "bg-red-800" : "bg-red-800 bg-opacity-10 hover:bg-red-800"}`}
    >
      {action === "like" ? <FaHeart /> : <HiMiniUserPlus />}
    </button>
  );
}
