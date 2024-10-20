import { db } from '@/database/firebaseConfig';
import { PostTypeData } from '@/types/types';
import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const postsCollection = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsCollection);
    const postsList: PostTypeData[] = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as PostTypeData));

    return NextResponse.json(postsList);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}
