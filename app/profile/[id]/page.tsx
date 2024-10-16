"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserInfos } from "@/database/services/userService";
import { UserTypeData } from "@/database/types/types";
import { useContextAuth } from "@/database/contexts/AuthContext";
import Loader from "@/app/components/Loader";
import HeaderProfil from "@/app/components/profile/HeaderProfil";
import UserInfosSection from "@/app/components/profile/InfosUserSection";
import GridPostUser from "@/app/components/profile/GridPostUser";

export default function ProfileSinglePage() {
  const { id } = useParams();

  const [userInfos, setUserInfos] = useState<UserTypeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return; 

      setLoading(true); 
      try {
        const fetchedUserInfos = await getUserInfos(id as string);
        setUserInfos(fetchedUserInfos);
      } catch (err) {
        setError('Erreur lors de la récupération des informations utilisateur.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]); 

  if (loading) { return <Loader />; }
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <h2 className="uppercase font-black text-2xl text-center">{error}</h2>
      </div>
    );
  }

  return userInfos && (
    <>
      <HeaderProfil userInfos={userInfos} /> 
      <UserInfosSection userInfos={userInfos} /> 
      <GridPostUser id={userInfos?.idUser as string} /> 
    </>
  );
}
