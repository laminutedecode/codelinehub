import { NextResponse } from 'next/server';
import { db } from '@/database/firebaseConfig'; 
import { collection, doc, deleteDoc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export const DELETE = async (req: Request) => {
  try {
    const { idUser, currentUserId } = await req.json(); 

   
    if (!currentUserId) {
      return NextResponse.json({ error: 'Utilisateur non connecté.' }, { status: 403 });
    }

    const userDocRef = doc(db, 'members', currentUserId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé. Vous devez être un administrateur.' }, { status: 403 });
    }

    const userToDeleteDocRef = doc(db, 'members', idUser);
    const userToDeleteDoc = await getDoc(userToDeleteDocRef);

    if (!userToDeleteDoc.exists()) {
      return NextResponse.json({ error: 'L\'utilisateur à supprimer n\'existe pas.' }, { status: 404 });
    }

    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('authorId', '==', idUser));
    const postsSnapshot = await getDocs(q);

    const storage = getStorage();
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      if (postData.image) {
        const imageRef = ref(storage, postData.image);
        await deleteObject(imageRef);
      }
      await deleteDoc(postDoc.ref);
    }

    await deleteDoc(userToDeleteDocRef);

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès.' }, { status: 200 });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    return NextResponse.json({ error: 'Erreur lors de la suppression de l\'utilisateur.' }, { status: 500 });
  }
};
