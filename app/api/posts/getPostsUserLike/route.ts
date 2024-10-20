import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/firebaseConfig';
import { collection, getDoc, doc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const memberRef = collection(db, 'members');
    const memberDoc = await getDoc(doc(memberRef, userId));
    const memberData = memberDoc.data();

    if (!memberData || !memberData.usersPostsListLike) {
      return NextResponse.json({ error: 'No liked posts found' }, { status: 404 });
    }

    const likedPostsIds: string[] = memberData.usersPostsListLike;

    if (likedPostsIds.length === 0) {
      return NextResponse.json({ message: 'No liked posts found', posts: [] });
    }

    const fetchedPosts = await Promise.all(
      likedPostsIds.map(async (postId) => {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        return { id: postDoc.id, ...postDoc.data() };
      })
    );

    return NextResponse.json({ posts: fetchedPosts });
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    return NextResponse.json({ error: 'Failed to fetch liked posts' }, { status: 500 });
  }
}
