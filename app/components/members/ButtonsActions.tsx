import { FaHeart } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";
import { db } from "@/database/firebaseConfig"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useContextAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

type ActionType = "like" | "follow";

interface ButtonActionProps {
  idUserProfile: string;
  action: ActionType; 
}

export default function ButtonsActions({ idUserProfile, action }: ButtonActionProps) {
  const { user } = useContextAuth(); 
  const idUserCurrent = user?.idUser;

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

      await updateDoc(userRef, {
        ...(action === "like" ? { nbLikeProfile: newCount, usersLike: newUsers } : { nbFollowProfil: newCount, usersFollow: newUsers }),
      });
      
      toast.success(hasActioned ? (action === "like" ? "Like retiré ❌" : "Follow retiré ❌") : (action === "like" ? "Like ajouté ❎" : "Follow ajouté ❎"));
    }
  };

  return (
    <button 
      title={action === "like" ? "Like" : "Follow"}
      name={action === "like" ? "Like" : "Follow"}
      type="button" 
      onClick={handleToggle} 
      className="flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md text-sm"
    >
      {action === "like" ? <FaHeart /> : <HiMiniUserPlus />}
    </button>
  );
}
