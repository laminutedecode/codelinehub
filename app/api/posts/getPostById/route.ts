import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function POST(req: Request) {
  const { id } = await req.json();

  try {
    const postDoc = doc(db, 'posts', id);
    const postSnapshot = await getDoc(postDoc);

    if (postSnapshot.exists()) {
      return NextResponse.json(postSnapshot.data());
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
  }
}
