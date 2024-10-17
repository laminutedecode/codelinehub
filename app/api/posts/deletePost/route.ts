import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "@/database/firebaseConfig";

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();  // Récupère l'ID depuis le corps de la requête
  const postDocRef = doc(db, "posts", id);

  try {
    const postSnapshot = await getDoc(postDocRef);

    if (!postSnapshot.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postData = postSnapshot.data();
    const imageUrl = postData?.image;

    if (imageUrl) {
      const storage = getStorage();
      const decodedUrl = decodeURIComponent(imageUrl);
      const imagePath = decodedUrl.split("/").slice(-2).join("/").split("?")[0];
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);  // Supprime l'image liée au post
    }

    await deleteDoc(postDocRef);  // Supprime le document du post
    return NextResponse.json({ message: "Post deleted successfully" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'DELETE' } });
}
