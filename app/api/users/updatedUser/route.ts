import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updatedUserData } = await req.json();


    if (!id) {
      throw new Error('ID is missing');
    }

    const userDoc = doc(db, 'members', id);
    await updateDoc(userDoc, updatedUserData);
    
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

