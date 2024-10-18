import { NextResponse } from 'next/server';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function POST(request: Request) {
  try {
    const { currentUserId, ...postData } = await request.json();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Accès refusé. Vous devez être connecté.' }, { status: 403 });
    }
    
    const postsCollection = collection(db, 'posts');

    await addDoc(postsCollection, postData);
    
    return NextResponse.json({ message: "Post added successfully" }, { status: 201 });
  } catch (err) {
    console.error("Error adding post:", err);
    return NextResponse.json({ error: "Error adding post" }, { status: 500 });
  }
}
