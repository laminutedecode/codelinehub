import { db } from "@/database/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { useContextAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function ButtonLikePost({ idPost }: { idPost: string }) {
  const { user } = useContextAuth();
  const [loading, setLoading] = useState(false);

  const handleLikeToggle = async () => {
    const idUserCurrent = user?.idUser as string;

    if (!idUserCurrent || !idPost) {
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, `posts/${idPost}`);
      const userRefUser = doc(db, `members/${idUserCurrent}`);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.data();
        let newLikeCountPost = userData.nbLikePost || 0;
        let newUsersLikePost = userData.usersLikePost || [];

        const hasLiked = newUsersLikePost.includes(idUserCurrent);

        if (hasLiked) {
          newLikeCountPost -= 1;
          newUsersLikePost = newUsersLikePost.filter((userId: string) => userId !== idUserCurrent);
        } else {
          newLikeCountPost += 1;
          newUsersLikePost.push(idUserCurrent);
        }

        await updateDoc(userRef, {
          nbLikePost: newLikeCountPost,
          usersLikePost: newUsersLikePost,
        });

        const userSnapshot = await getDoc(userRefUser);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          let newUsersPostsListLike = userData.usersPostsListLike || [];

          if (hasLiked) {
            newUsersPostsListLike = newUsersPostsListLike.filter((postId: string) => postId !== idPost);
          } else {
            if (!newUsersPostsListLike.includes(idPost)) {
              newUsersPostsListLike.push(idPost);
            }
          }
          await updateDoc(userRefUser, {
            usersPostsListLike: newUsersPostsListLike,
          });
          toast.success(hasLiked ? "Like retiré ❌" : "Like ajouté ❎");
        }
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasLiked = user?.usersLikePost?.includes(user?.idUser as string);

  return (
    <button 
      type="button" 
      onClick={handleLikeToggle} 
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 text-white my-3 rounded-md ${
        hasLiked ? 'bg-purple-500' : 'bg-purple-500 bg-opacity-50 hover:bg-purple-800'
      }`}
    >
      <FaHeart />
    </button>
  );
}
