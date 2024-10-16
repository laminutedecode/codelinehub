import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/database/firebaseConfig"; 
import { PostTypeData } from "@/database/types/types"; 

export async function POST(req: NextRequest) {
  const { id } = await req.json(); 

  try {
    const postsCollection = collection(db, "posts"); 
    const q = query(postsCollection, where("authorId", "==", id as string)); 

    const querySnapshot = await getDocs(q); 

    const userPosts: PostTypeData[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as PostTypeData); 

    return NextResponse.json(userPosts); 
  } catch (err) {
    console.error("Error fetching user posts:", err);
    return NextResponse.json({ error: "Error fetching user posts" }, { status: 500 }); 
  }
}
