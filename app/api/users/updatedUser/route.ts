import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function PUT(req: NextRequest) {
  try {
    const { idUser, currentUserId, ...updatedUserData } = await req.json();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Accès refusé. Vous devez être connecté.' }, { status: 403 });
    }

    if (!idUser) {
      throw new Error('ID is missing');
    }

    const userDoc = doc(db, 'members', idUser);
    await updateDoc(userDoc, updatedUserData);
    
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}
