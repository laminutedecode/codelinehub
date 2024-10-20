import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); 
  const id = searchParams.get('id'); 

  if (!id) {
    return NextResponse.json({ error: 'ID du post manquant' }, { status: 400 });
  }

  try {
    const postDoc = doc(db, 'posts', id);
    const postSnapshot = await getDoc(postDoc);

    if (postSnapshot.exists()) {
      return NextResponse.json(postSnapshot.data());
    } else {
      return NextResponse.json({ error: 'Post non trouvé' }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur lors de la récupération du post' }, { status: 500 });
  }
}
