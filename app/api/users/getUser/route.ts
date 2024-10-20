import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); 
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID de l\'utilisateur manquant' }, { status: 400 });
  }

  try {
    const userDoc = doc(db, 'members', id); 
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return NextResponse.json(userSnapshot.data());
    } else {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'utilisateur' }, { status: 500 });
  }
}
