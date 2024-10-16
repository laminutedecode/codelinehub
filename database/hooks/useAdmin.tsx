import { db } from "@/database/firebaseConfig";
import { UserTypeData } from "@/database/types/types";
import { collection, getDocs, doc, deleteDoc, where, query } from "firebase/firestore"; // Ajoutez deleteDoc
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const useAdmin = () => {
  const [members, setMembers] = useState<UserTypeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersCollectionRef = collection(db, "members");
        const membersSnapshot = await getDocs(membersCollectionRef);
        
        const membersList = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as UserTypeData
        })) 
        setMembers(membersList);
      } catch (err) {
        setError("Erreur lors de la récupération des membres.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  

  // Fonction pour vérifier si un utilisateur est admin
  const isUserAdmin = (userId: string): boolean => {
    const user = members.find(member => member.idUser === userId);
    return user ? user.role === 'admin' : false;
  };


  
  const deleteUser = async (userId: string) => {
    try {
      // Étape 1 : Récupérer tous les posts de l'utilisateur
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("authorId", "==", userId));
      const postsSnapshot = await getDocs(q);
  
      // Étape 2 : Supprimer chaque post et ses images associées
      const storage = getStorage();
      for (const postDoc of postsSnapshot.docs) {
        const postData = postDoc.data();
        const postId = postDoc.id;
  
        // Supprimer l'image associée si elle existe
        if (postData.image) {
          const imageRef = ref(storage, postData.image);
          await deleteObject(imageRef);
          console.log("Image supprimée :", postData.image);
        }
  
        // Supprimer le post
        await deleteDoc(postDoc.ref);
        console.log("Post supprimé :", postId);
      }
  
      // Étape 3 : Supprimer l'utilisateur
      const userDocRef = doc(db, "members", userId);
      await deleteDoc(userDocRef);
  
      // Mettre à jour la liste des membres après la suppression
      setMembers(prevMembers => prevMembers.filter(member => member.idUser !== userId));
      console.log("Utilisateur supprimé avec succès :", userId);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
    }
  };
  

  return { members, loading, error, isUserAdmin, deleteUser }; // Ajoutez deleteUser ici
};

export default useAdmin;
