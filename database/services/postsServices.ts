import { doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "@/database/firebaseConfig";
import { redirect } from "next/navigation";
import { PostTypeData } from "../types/types";

// Fonction pour récupérer un post par ID

export const getPostById = async (postId: string): Promise<PostTypeData | null> => {
  try {
    const postDoc = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postDoc);

    if (postSnapshot.exists()) {
      return postSnapshot.data() as PostTypeData;
    } 
  } catch (err) {
    console.error("Erreur lors de la récupération du post:", err);
    return null; // Assurez-vous de retourner null en cas d'erreur
  }
};



// Fonction pour récupérer tous les posts
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




// Fonction pour mettre à jour un post existant
export const updatePost = async (postId: string, updatedPostData: Partial<PostTypeData>): Promise<void> => {
  try {
    const postDoc = doc(db, "posts", postId);
    await updateDoc(postDoc, updatedPostData);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du post:", err);
    throw new Error("Erreur lors de la mise à jour du post.");
  }
};


// Fonction pour supprimer un post et son image associée dans Firebase Storage
export const deletePost = async (postId: string): Promise<void> => {
  try {
  
    const postDocRef = doc(db, "posts", postId);

    const postSnapshot = await getDoc(postDocRef);

    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const imageUrl = postData?.image; // URL de l'image du post

      // Vérifier si une image existe et supprimer l'image du Storage si c'est le cas
      if (imageUrl) {
        const storage = getStorage();

        // Extraire uniquement le chemin du fichier à partir de l'URL complète de l'image
        const decodedUrl = decodeURIComponent(imageUrl); // Décoder les caractères encodés dans l'URL
        const imagePath = decodedUrl.split("/").slice(-2).join("/").split("?")[0]; // Récupérer le chemin correct

        if (imagePath) {
          const imageRef = ref(storage, imagePath); // Utiliser le chemin correct

          try {
            await deleteObject(imageRef);
          } catch (imageDeletionError) {
            throw new Error("Erreur lors de la suppression de l'image.");
          }
        }
      }

      // Supprimer le document du post dans Firestore
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
