import { FaHeart } from "react-icons/fa";
import { db } from "@/database/firebaseConfig"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useContextAuth } from "@/database/contexts/AuthContext";
import { toast } from "react-toastify";

export default function ButtonLike({ idUserProfile }: {  idUserProfile: string }) {


  const { user } = useContextAuth();
  const idUserCurrent = user?.idUser; 

  const handleLikeToggle = async () => {
    const userRef = doc(db, `members/${idUserProfile}`);


    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.data();

      let newLikeCount = userData.nbLikeProfile || 0;
      let newUsersLike = userData.usersLike || [];

      const hasLiked = newUsersLike.includes(idUserCurrent);

      if (hasLiked) {
        newLikeCount -= 1; 
        newUsersLike = newUsersLike.filter((userId: string) => userId !== idUserCurrent);
      } else {
        newLikeCount += 1; 
        newUsersLike.push(idUserCurrent); 
      }

      await updateDoc(userRef, {
        nbLikeProfile: newLikeCount,
        usersLike: newUsersLike,
      });
      toast.success(hasLiked ? "Like retiré ❌" : "Like ajouté ❎");
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleLikeToggle} 
      className="flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md"
    >
      <FaHeart />
    </button>
  );
}
