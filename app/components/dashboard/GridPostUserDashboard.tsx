"use client";

import Loader from "@/app/components/Loader";
import { useContextAuth } from "@/contexts/AuthContext";
import { PostTypeData } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { toast } from "react-toastify";

export default function GridPostUserDashboard() {
  const { user } = useContextAuth(); 
  const [posts, setPosts] = useState<PostTypeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user?.idUser) { 
        setLoading(true); 
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
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleDelete = async (postId: string) => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce post ?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/posts/deletePost`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: postId, currentUserId: user?.idUser, }), 
        });

        if (!response.ok) throw new Error("Erreur lors de la suppression du post.");

        toast.success("Post supprimé avec succès.");
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        toast.error("Erreur lors de la suppression du post.");
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full pt-4 px-6">
      {loading ? ( // Afficher le Loader si en cours de chargement
        <Loader />
      ) : (
        <>
          <p className="text-md text-white pb-2 mb-2">{posts.length} Post{posts.length > 1 && "s"}:</p>
          {posts.length === 0 ? (
            <p>Vous n'avez aucun post.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {posts.map((post) => (
                <li key={post.id} className="w-full border rounded-md overflow-hidden">
                  <Image src={post?.image as string} alt={post?.title} width={300} height={100} className="w-full" />
                  <div className="my-2 p-2">
                    <h2 className="text-md font-bold text-white line-clamp-2 mb-2">{post.title}</h2>
                    <div className="flex justify-end items-center gap-2">
                      <Link href={`/posts/${post?.id}`} className="bg-green-500 hover:bg-green-800 px-3 py-1.5 text-white rounded-md">
                        <FaEye />
                      </Link>
                      <Link href={`/dashboard/member/posts/edit/${post?.id}`} className="bg-yellow-500 hover:bg-yellow-800 px-3 py-1.5 text-white rounded-md">
                        <MdEditSquare />
                      </Link>
                      <button onClick={() => handleDelete(post?.id as string)} className="flex items-center gap-2 bg-red-500 hover:bg-red-700 px-3 py-1.5 text-white rounded">
                        <BiTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
