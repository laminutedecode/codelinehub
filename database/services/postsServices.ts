import { doc, getDoc, addDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "@/database/firebaseConfig";
import { PostTypeData } from "../types/types";


export const getPostById = async (postId: string): Promise<PostTypeData | null> => {
  try {
    const postDoc = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postDoc);

    if (postSnapshot.exists()) {
      return postSnapshot.data() as PostTypeData;
    } else {
      return null; 
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du post:", err);
    return null; 
  }
};

export const getAllPosts = async (): Promise<PostTypeData[]> => {
  try {
    const postsCollection = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollection);
    const postsList: PostTypeData[] = postsSnapshot.docs.map(doc => ({
      id: doc.id, // Inclure l'ID ici
      ...doc.data() as PostTypeData,
    }));
    
    return postsList;
  } catch (err) {
    console.error("Erreur lors de la récupération des posts:", err);
    throw new Error("Erreur lors de la récupération des posts.");
  }
};


export const addPost = async (postData: PostTypeData): Promise<void> => {
  try {
    const postsCollection = collection(db, "posts");

   
    if (typeof postData !== 'object' || Array.isArray(postData)) {
      throw new Error("postData doit être un objet.");
    }

    await addDoc(postsCollection, postData);
    console.log("Post ajouté avec succès.");
  } catch (err) {
    console.error("Erreur lors de l'ajout du post:", err);
    throw new Error("Erreur lors de l'ajout du post.");
  }
};

export const updatePost = async (postId: string, updatedPostData: Partial<PostTypeData>): Promise<void> => {
  try {
    const postDoc = doc(db, "posts", postId);
    await updateDoc(postDoc, updatedPostData);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du post:", err);
    throw new Error("Erreur lors de la mise à jour du post.");
  }
};


export const deletePost = async (postId: string): Promise<void> => {
  try {
  
    const postDocRef = doc(db, "posts", postId);

    const postSnapshot = await getDoc(postDocRef);

    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const imageUrl = postData?.image;

      if (imageUrl) {
        const storage = getStorage();

        const decodedUrl = decodeURIComponent(imageUrl); 
        const imagePath = decodedUrl.split("/").slice(-2).join("/").split("?")[0];

        if (imagePath) {
          const imageRef = ref(storage, imagePath); 

          try {
            await deleteObject(imageRef);
          } catch (imageDeletionError) {
            throw new Error("Erreur lors de la suppression de l'image.");
          }
        }
      }

      await deleteDoc(postDocRef);
    } else {
      throw new Error("Post non trouvé.");
    }
  } catch (err) {
    throw new Error("Erreur lors de la suppression du post.");
  }
};

export const getUserPosts = async (idUser: string): Promise<PostTypeData[]> => {
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection, where('authorId', '==', idUser));
  const querySnapshot = await getDocs(q);
  
  const posts: PostTypeData[] = [];
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as PostTypeData); 
  });
  
  return posts;
};
