"use client";

import Loader from "@/app/components/Loader";
import MemberHeader from "@/app/components/members/MemberHeader";
import MemberContent from "@/app/components/members/MemberContent";
import { UserTypeData } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


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
        const response = await fetch(`/api/users/getUser?id=${id}`, {
          method: 'GET', 
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

  if (loading || error) { return <Loader />; }

  return userInfos && (
    <section className="max-w-[1200px] mx-auto md:border-l md:border-r">
      <MemberHeader userInfos={userInfos} id={id as string} /> 
      <MemberContent userInfos={userInfos} /> 
    </section>
  );
}
