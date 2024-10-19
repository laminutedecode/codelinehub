"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserTypeData, PostTypeData } from "@/database/types/types";
import Loader from "@/app/components/Loader";
import HeaderPost from "@/app/components/posts/HeaderPost";
import ContentPost from "@/app/components/posts/ContentPost";


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
          const response = await fetch(`/api/posts/getPostById`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }) 
          }); 
          
          if (!response.ok) {
            throw new Error('Post non trouvé.');
          }
          
          const fetchedDataPost = await response.json();
          setDataPost(fetchedDataPost);
  
          const userResponse = await fetch(`/api/users/getUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: fetchedDataPost.authorId })
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
          <HeaderPost userInfos={userInfos} postData={dataPost} id={id} />
          <ContentPost userInfos={userInfos} postData={dataPost} />
        </>
      )}
    </>
  );
}
