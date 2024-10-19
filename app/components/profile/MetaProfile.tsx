import { useEffect, useState } from "react";
import { db } from "@/database/firebaseConfig"; 
import { doc, onSnapshot } from "firebase/firestore";
import { FaHeart } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";

export default function MetaProfile({ idUserProfile }: { idUserProfile: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [followers, setFollowers] = useState<number | null>(null);

  useEffect(() => {
    const userRef = doc(db, `members/${idUserProfile}`);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data();
        setLikes(userData.nbLikeProfile || 0);
        setFollowers(userData.nbFollowProfil || 0);
      } else {
        setLikes(null);
        setFollowers(null);
      }
    });

    return () => unsubscribe();
  }, [idUserProfile]);

  return (
    <ul className="text-white flex items-center gap-2 mt-2">
      <li className="text-white text-sm flex items-center gap-2">
        <FaHeart /> <span>{likes !== null ? likes : '0'} like{likes && likes > 0 && 's'}</span>
      </li>
      <li className="text-white text-sm flex items-center gap-2">
        <HiMiniUserPlus /> <span>{followers !== null ? followers : '0'} Follower{likes && likes > 0 && 's'}</span>
      </li>
    </ul>
  );
}
