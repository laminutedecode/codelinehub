import { NextApiRequest, NextApiResponse } from "next";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/database/firebaseConfig";
import { PostTypeData } from "@/database/types/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const postData: PostTypeData = req.body;
      const postsCollection = collection(db, "posts");
      await addDoc(postsCollection, postData);
      res.status(201).json({ message: "Post added successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error adding post" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
