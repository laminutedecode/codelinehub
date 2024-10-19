import { HiMiniUserPlus } from "react-icons/hi2";
import { db } from "@/database/firebaseConfig"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useContextAuth } from "@/database/contexts/AuthContext";
import { toast } from "react-toastify";

export default function ButtonFollow({  idUserProfile }: { idUserProfile: string }) {

  const { user } = useContextAuth(); // Récupération de l'utilisateur connecté
  const idUserCurrent = user?.idUser; // Récupération de l'ID de l'utilisateur


  const handleFollowToggle = async () => {
    const userRef = doc(db, `members/${idUserProfile}`);

    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.data();

      let newFollowCount = userData.nbFollowProfil || 0;
      let newUsersFollow = userData.usersFollow || [];

      const isFollowing = newUsersFollow.includes(idUserCurrent);

      if (isFollowing) {
        newFollowCount -= 1; 
        newUsersFollow = newUsersFollow.filter((userId: string) => userId !== idUserCurrent); 
      } else {
        newFollowCount += 1;
        newUsersFollow.push(idUserCurrent); 
      }
      await updateDoc(userRef, {
        nbFollowProfil: newFollowCount,
        usersFollow: newUsersFollow,
      });
      toast.success(isFollowing ? "Follow retiré ❌" : "Follow ajouté ❎"); 
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleFollowToggle} 
      className="flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md"
    >
      <HiMiniUserPlus />
    </button>
  );
}
