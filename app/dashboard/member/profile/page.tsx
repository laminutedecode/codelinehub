"use client";

import Loader from "@/app/components/Loader";
import ProfileCard from "@/app/components/dashboard/CardProfile";
import CountDashboard from "@/app/components/dashboard/CountDashboard";
import { useContextAuth } from "@/contexts/AuthContext";
import { PostTypeData, UserTypeData } from "@/types/types";
import { useEffect, useState } from "react";

export default function PageDashboard() {
  const { user } = useContextAuth();
  const [userInfos, setUserInfos] = useState<UserTypeData | null>(null);
  const [posts, setPosts] = useState<PostTypeData[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.idUser) {
        setIsloading(true);
        try {
          const postsResponse = await fetch(`/api/posts/getPostByAuthor?id=${user.idUser}`, {
            method: "GET",
          });

          if (!postsResponse.ok)
            throw new Error("Erreur lors de la récupération des posts.");
          const userPosts = await postsResponse.json();
          setPosts(userPosts);

          const userResponse = await fetch(`/api/users/getUser?id=${user.idUser}`, {
            method: "GET",
          });

          if (!userResponse.ok)
            throw new Error(
              "Erreur lors de la récupération des informations utilisateur."
            );
          const fetchedUserInfos = await userResponse.json();
          setUserInfos(fetchedUserInfos);
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
        } finally {
          setIsloading(false);
        }
      }
    };

    fetchData();
  }, [user?.idUser]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full p-8 text-white">
      <ProfileCard userInfos={userInfos} />
      <CountDashboard id={user?.idUser as string} postsCount={posts.length}/>
    </div>
  );
}
