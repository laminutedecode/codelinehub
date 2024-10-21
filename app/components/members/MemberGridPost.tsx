"use client";

import { PostTypeData } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

export default function MemberGridPost( {id }: {id: string}) {


  const [posts, setPosts] = useState<PostTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPosts = async () => {
    if (id) { 
      setLoading(true); 
      try {
        const response = await fetch(`/api/posts/getPostByAuthor?id=${id}`, {
          method: "GET", 
        });

        if (!response.ok) throw new Error('Erreur lors de la récupération des posts.');
        const userPosts = await response.json();
        setPosts(userPosts);
      } catch (error : any) {
        console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    }
  };

  useEffect(() => {
    fetchUserPosts(); 
  }, [id]); 


  return (
    <div className="w-full mt-4">
      <h3 className="text-sm text-white mb-2 "> {posts.length} Post{posts.length > 1 && "s"}: </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">Aucun post .</p>
        ) : (
          posts.map((post) => (
            <li  key={post.id} className="w-full border rounded-md overflow-hidden">
                <Image src={post?.image as string} alt={post?.title} width={300} height={100} className="w-full" />
                <div className="my-2 p-2">
                <h4 className="text-sm font-bold text-white break-words mb-2">{post.title}</h4>
                <Link title={`Lire article ${post?.title}`} href={`/posts/${post.id}`} className="inline-flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white rounded-md text-sm">
                  <FaEye/>
                </Link>
                </div>
            </li>
          ))
         )}
      </ul>
    </div>
  );
}
