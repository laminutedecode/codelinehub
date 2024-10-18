"use client";

import Image from "next/image";
import Link from "next/link";
import { PostTypeData } from "@/database/types/types";
import { useEffect, useState } from "react";
import { useContextAuth } from "@/database/contexts/AuthContext";
import { FaEye } from "react-icons/fa";

export default function GridPostUserProfil( {id }: {id: string}) {

  const { user } = useContextAuth(); 
  const [posts, setPosts] = useState<PostTypeData[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user?.idUser) { 
        try {
          const response = await fetch(`/api/posts/getPostByAuthor`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user.idUser }), 
          });

          if (!response.ok) throw new Error('Erreur lors de la récupération des posts.');
          const userPosts = await response.json();
          setPosts(userPosts);
        } catch (error) {
          console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
        }
      }
    };

    fetchUserPosts();
  }, [user, id]);


  return (
    <div className="max-w-[1200px] mx-auto w-full md:border-l md:border-r pt-4 px-6">
      <h3 className="text-lg md:text-xl font-bold text-white border-b border-purple-500 pb-2 mb-2 "> {posts.length} Post{posts.length > 1 && "s"}: </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">Aucun post trouvé.</p>
        ) : (
          posts.map((post) => (
            <li  key={post.id} className="w-full border rounded-md overflow-hidden">
                <Image src={post?.image as string} alt={post?.title} width={300} height={100} className="w-full" />
                <div className="my-2 p-2">
                <h2 className="text-sm font-bold text-white break-words mb-2">{post.title}</h2>
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
