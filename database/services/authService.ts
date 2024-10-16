import { db } from '@/database/firebaseConfig';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
