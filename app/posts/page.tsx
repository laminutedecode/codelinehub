"use client";

import Image from "next/image";
import Link from "next/link";
import { PostTypeData } from "@/database/types/types";
import { useEffect, useState } from "react";
import { getAllPosts } from "@/database/services/postsServices";
import Loader from "@/app/components/Loader"; 

export default function PostsPage() {
  const [posts, setPosts] = useState<PostTypeData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // État de chargement

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const postsAll = await getAllPosts();
        setPosts(postsAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts", error);
      } finally {
        setLoading(false); // Mettre à jour l'état de chargement à false
      }
    };

    fetchUserPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Si en cours de chargement, afficher le Loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full md:border-l md:border-r pt-4 px-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par titre, description ou catégorie..."
          className="w-full h-10 border border-gray-300 rounded p-4 outline-none bg-transparent focus:ring-purple-500 text-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p className="text-sm text-white text-center mt-2">
          Total: {filteredPosts.length} post{filteredPosts.length > 1 && "s"}
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {filteredPosts.length === 0 ? (
          <p className="text-white">Aucun post trouvé.</p>
        ) : (
          filteredPosts.map((post) => (
            <li key={post.id} className="w-full border rounded-md overflow-hidden">
              <Image src={post?.image as string} alt={post?.title} width={300} height={100} className="w-full" />
              <div className="my-2 p-2">
                <h2 className="text-md font-bold text-white line-clamp-2 mb-2">{post.title}</h2>
                <Link href={`/posts/${post.id}`} className="text-sm text-purple-500 hover:text-purple-800">
                  Lire le post
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}