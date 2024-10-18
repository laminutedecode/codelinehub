import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function PUT(req: NextRequest) {
  const { id,currentUserId, ...updatedPostData } = await req.json();
  const postDoc = doc(db, 'posts', id); 
  try {

    if (!currentUserId) {
      return NextResponse.json({ error: 'Utilisateur non connecté.' }, { status: 403 });
    }
    
    await updateDoc(postDoc, updatedPostData);
    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'PUT' } });
}
