import { db } from '@/database/firebaseConfig';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const addUserToMemberCollection = async (user: User) => {
  try {
    const userDocRef = doc(db, 'members', user.uid); 

    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      console.log("L'utilisateur existe déjà dans la collection 'members'.");
      return; 
    }

   
    const image = user.photoURL || ''; 

    await setDoc(userDocRef, {
      firstName: user.displayName, 
      lastName: user.displayName, 
      description: '', 
      job: '', 
      websiteUrl: '', 
      githubUrl: '', 
      youtubeUrl: '', 
      instagramUrl: '', 
      inscription: new Date(), 
      role:  'member', 
      email: user.email, 
      idUser: user.uid,
      image: image || null, 
      background: '', 
      languages: [],
    });

    console.log("Utilisateur ajouté avec succès à la collection 'members'.");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur à la collection 'members' :", error);
  }
};



export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const {currentUser} = getAuth();
  const idCurrentUser = currentUser?.uid;
    const membersCollectionRef = collection(db, "members");
    const membersSnapshot = await getDocs(membersCollectionRef);
    
    const user = membersSnapshot.docs.find(doc => doc.id === idCurrentUser);
    
    if (!user || user.data().role !== 'admin') {
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Erreur lors de la vérification du rôle:", err);
    return false; 
  }
};
