import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function GET() {
  try {
    const membersCollection = collection(db, 'members');
    const membersSnapshot = await getDocs(membersCollection);
    
    const membersList = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(membersList);
  } catch (err) {
    console.error("Error fetching members:", err);
    return NextResponse.json({ error: 'Error fetching members' }, { status: 500 });
  }
}
