"use client"

import Loader from "@/app/components/Loader";
import PostContent from "@/app/components/posts/PostContent";
import PostHeader from "@/app/components/posts/PostHeader";
import { PostTypeData, UserTypeData } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostSinglePage() {
  const { id } = useParams(); 
  
  const [dataPost, setDataPost] = useState<PostTypeData | null>(null);
  const [userInfos, setUserInfos] = useState<UserTypeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        if (id) {
          const response = await fetch(`/api/posts/getPostById?id=${id}`, {
            method: 'GET', 
          });
          
          if (!response.ok) {
            throw new Error('Post non trouvé.');
          }
          
          const fetchedDataPost = await response.json();
          setDataPost(fetchedDataPost);
  
      
          const userResponse = await fetch(`/api/users/getUser?id=${fetchedDataPost.authorId}`, {
            method: 'GET', 
          });
  
          if (!userResponse.ok) {
            throw new Error('Informations utilisateur non trouvées.');
          }
          
          const userData = await userResponse.json();
          setUserInfos(userData);
        } else {
          setError('ID du post est manquant.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des informations du post.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  
  

  if (loading) { 
    return <Loader />; 
  }
  
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-white">
        <h2 className="uppercase font-black text-2xl text-center">{error}</h2>
      </div>
    );
  }

  return (
    <>
      {dataPost && userInfos && (
        <>
          <PostHeader userInfos={userInfos} postData={dataPost} id={id as string} />
          <PostContent userInfos={userInfos} postData={dataPost} id={id as string} /> 
        </>
      )}
    </>
  );
}
