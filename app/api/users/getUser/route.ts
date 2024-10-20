import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function POST(req: Request) {
  const { id } = await req.json();
  try {
    const userDoc = doc(db, 'members', id);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return NextResponse.json(userSnapshot.data());
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
