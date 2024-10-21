import { db } from "@/database/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const toggleLikePost = async (idPost: string, idUserCurrent: string) => {
  try {
    const postRef = doc(db, `posts/${idPost}`);
    const userRefUser = doc(db, `members/${idUserCurrent}`);
    
    const postSnapshot = await getDoc(postRef);
    const userSnapshot = await getDoc(userRefUser);

    if (postSnapshot.exists() && userSnapshot.exists()) {
      const postData = postSnapshot.data();
      const userData = userSnapshot.data();
      let newLikeCountPost = postData?.nbLikePost || 0;
      let newUsersLikePost = postData?.usersLikePost || [];
      const userHasLiked = newUsersLikePost.includes(idUserCurrent);

      if (userHasLiked) {
        newLikeCountPost -= 1;
        newUsersLikePost = newUsersLikePost.filter((userId: string) => userId !== idUserCurrent);
      } else {
        newLikeCountPost += 1;
        newUsersLikePost.push(idUserCurrent);
      }

      await updateDoc(postRef, {
        nbLikePost: newLikeCountPost,
        usersLikePost: newUsersLikePost,
      });

      let newUsersPostsListLike = userData?.usersPostsListLike || [];

      if (userHasLiked) {
        newUsersPostsListLike = newUsersPostsListLike.filter((postId: string) => postId !== idPost);
      } else {
        if (!newUsersPostsListLike.includes(idPost)) {
          newUsersPostsListLike.push(idPost);
        }
      }

      await updateDoc(userRefUser, {
        usersPostsListLike: newUsersPostsListLike,
      });

      return !userHasLiked; 
    }

  } catch (error) {
    console.error("Error updating likes:", error);
    throw error; 
  }
};


export const getInitialLikeState = async (idPost: string, idUserCurrent: string) => {
  try {
    const postRef = doc(db, `posts/${idPost}`);
    const snapshot = await getDoc(postRef);

    if (snapshot.exists()) {
      const postData = snapshot.data();
      const usersWhoLikedPost = postData?.usersLikePost || [];
      return usersWhoLikedPost.includes(idUserCurrent); 
    }
    return false;
  } catch (error) {
    console.error("Error fetching initial like state:", error);
    throw error;
  }
};
