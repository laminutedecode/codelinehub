"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserTypeData } from "@/database/types/types";
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
        const response = await fetch(`/api/users/getUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }) 
        });

        if (!response.ok) {
          throw new Error('Informations utilisateur non trouvées.');
        }

        const fetchedUserInfos = await response.json();
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
