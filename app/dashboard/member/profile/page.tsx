"use client";

import { useEffect, useState } from "react";
import { PostTypeData, UserTypeData } from "@/database/types/types";
import { useContextAuth } from "@/database/contexts/AuthContext";
import Loader from "@/app/components/Loader";
import ProfileCard from "@/app/components/dashboard/CardProfile";
import CountPost from "@/app/components/dashboard/CountPost";

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
          const postsResponse = await fetch(`/api/posts/getPostByAuthor`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user.idUser }),
          });

          if (!postsResponse.ok)
            throw new Error("Erreur lors de la récupération des posts.");
          const userPosts = await postsResponse.json();
          setPosts(userPosts);

          const userResponse = await fetch("/api/users/getUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user.idUser }),
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
      <CountPost postsCount={posts.length} />
    </div>
  );
}
