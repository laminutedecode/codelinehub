"use client";


import Image from "next/image";
import Link from "next/link";
import { PostTypeData } from "@/database/types/types";
import { useEffect, useState } from "react";
import { getUserPosts } from "@/database/services/postsServices";
import { useContextAuth } from "@/database/contexts/AuthContext";



export default function GridPostUser( {id }: {id: string}) {

  const { user } = useContextAuth(); 
  const [posts, setPosts] = useState<PostTypeData[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user) {
        try {
          const userPosts = await getUserPosts(id); 
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
          <p>Aucun post trouvé.</p>
        ) : (
          posts.map((post) => (
            <li  key={post.id} className="w-full border rounded-md overflow-hidden">
                <Image src={post?.image as string} alt={post?.title} width={300} height={100} className="w-full" />
                <div className="my-2 p-2">
                <h2 className="text-sm font-bold text-white break-words mb-2">{post.title}</h2>
                <Link href={`/posts/${post.id}`} className="text-sm text-purple-500 hover:text-purple-800">Lire le post</Link>
                </div>
                
              
            
            </li>
          ))
    )}
  </ul>
    </div>
  );
}
