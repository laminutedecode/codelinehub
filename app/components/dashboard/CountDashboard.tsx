import { useEffect, useState } from "react";
import { db, database } from "@/database/firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { FaHeart } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";
import { MdChat } from "react-icons/md";
import { MdArticle } from "react-icons/md";


interface CountDashboardProps {
  id: string;
  postsCount: number;
}

export default function CountDashboard({ id, postsCount }: CountDashboardProps) {
  const [likesCount, setLikesCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [chatsCount, setChatsCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, `members/${id}`);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.data();
        setLikesCount(userData.nbLikeProfile || 0);
        setFollowersCount(userData.nbFollowProfil || 0);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const chatsRef = ref(database, "chats");

    if (id) {
      const unsubscribe = onValue(chatsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const userChatsCount = Object.keys(data).filter(
            (chatId) =>
              data[chatId].idUserSend === id ||
              data[chatId].idUserReciper === id
          ).length;

          setChatsCount(userChatsCount);
        } else {
          setChatsCount(0);
        }
      });

      return () => unsubscribe();
    }
  }, [id]);

  const countsUser = [
    {
      label: "NB de posts",
      count: postsCount,
      icon: MdArticle,
    },
    {
      label: "NB de Likes",
      count: likesCount,
      icon: FaHeart,
    },
    {
      label: "NB de Followers",
      count: followersCount,
      icon: HiMiniUserPlus,
    },
    {
      label: "NB de chats",
      count: chatsCount,
      icon: MdChat,
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {countsUser.map((count, index) => (
        <div
          key={index}
          className="border rounded-md flex items-center justify-center flex-col gap-2 p-2 py-4"
        >
          <count.icon className="w-8 h-8" />
          <span>{count.label}</span>
          <span className="font-black text-4xl">{count.count}</span>
        
        </div>
      ))}
    </div>
  );
}
