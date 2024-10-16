"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPostById } from "@/database/services/postsServices"; 
import { getUserInfos } from "@/database/services/userService"; 
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
          const fetchedDataPost = await getPostById(id as string);
          if (fetchedDataPost) {
            setDataPost(fetchedDataPost);
            const userData = await getUserInfos(fetchedDataPost.authorId as string);
            setUserInfos(userData);
          } else {
            setError('Post non trouvé.');
          }
        }
      } catch (err) {
        setError('Erreur lors de la récupération des informations du post.');
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
          <HeaderPost userInfos={userInfos} postData={dataPost} />
          <ContentPost userInfos={userInfos} postData={dataPost} />
        </>
      )}
    </>
  );
}
