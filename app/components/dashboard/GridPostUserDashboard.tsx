"use client";


import Image from "next/image";
import Link from "next/link";
import { PostTypeData } from "@/database/types/types";
import { useEffect, useState } from "react";
import { deletePost, getUserPosts } from "@/database/services/postsServices";
import { useContextAuth } from "@/database/contexts/AuthContext";
import { BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";



export default function GridPostUserDashboard( {id }: {id: string}) {

  const router = useRouter();
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


  const handleDelete = async (postId: string) => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce post ?");
    if (confirmDelete) {
      await deletePost(postId);
      toast.success("post supprimé avec succès.");
      router.push('/dashboard/member/profile')
    }
  };


  return (
    <div className="max-w-[1200px] mx-auto w-full  pt-4 px-6">
      <p className="text-md  text-white pb-2 mb-2"> {posts.length} Post{posts.length > 1 && "s"}: </p>
        {posts.length === 0 ? (
          <p> Vous avez aucun post</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {
            posts.map((post) => (
              <li  key={post.id} className="w-full border rounded-md overflow-hidden">
                  
                <Image src={post?.image as string} alt={post?.title} width={300} height={100} className="w-full" />
                  <div className="my-2 p-2">
                  <h2 className="text-md font-bold text-white line-clamp-2 mb-2">{post.title}</h2>
                  <div className="flex justify-end items-center gap-2">
                  <Link
                      href={`/posts/${post?.id}`}
                      className="bg-green-500 hover:bg-green-800 px-3 py-1.5 text-white rounded-md"
                    >
                      <FaEye />
                    </Link>
                    <Link
                       href={`/dashboard/member/posts/edit/${post?.id}`}
                      className="bg-yellow-500 hover:bg-yellow-800 px-3 py-1.5 text-white rounded-md"
                    >
                      <MdEditSquare />
                    </Link>
                    <button onClick={()=> handleDelete(post?.id as string)} className="flex items-center gap-2  bg-red-500 hover:bg-red-700 px-3 py-1.5 text-white rounded "> <BiTrash/> </button>  
                  </div>            
                  </div>
                  
                
              
              </li>
          ))}
        
        </ul>
          )}
          </div>
        );
      }
