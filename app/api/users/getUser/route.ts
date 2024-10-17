import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/database/firebaseConfig';
import { UserTypeData } from '@/database/types/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // Extraction des paramètres d'URL
  const id = searchParams.get("id"); // Récupération de l'ID

  try {
    const usersCollection = collection(db, "members");
    const q = query(usersCollection, where("idUser", "==", id as string));
    const querySnapshot = await getDocs(q);
    const user: UserTypeData[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as UserTypeData);

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}
