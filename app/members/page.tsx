"use client";

import Loader from "@/app/components/Loader";
import { UserTypeData } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";

export default function UsersPage() {
  const [members, setMembers] = useState<UserTypeData[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/getUsersAll');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des membres');
      }
      const data: UserTypeData[] = await response.json();
      setMembers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchMembers(); 
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const filteredUser = members.filter((user) => {
    const firstName = user?.firstName?.toLowerCase() || "";
    const lastName = user?.lastName?.toLowerCase() || "";
    const job = user?.job?.toLowerCase() || "";

    return (
      firstName.includes(searchQuery.toLowerCase()) ||
      lastName.includes(searchQuery.toLowerCase()) ||
      job.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-[1200px] mx-auto w-full md:border-l md:border-r pt-4 px-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par Nom, Prénom ou Job..."
          className="w-full h-10 border border-gray-300 rounded p-4 outline-none bg-transparent focus:ring-purple-500 text-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p className="text-sm text-white text-center mt-2">
          Total: {filteredUser.length} utilisateur{filteredUser.length > 1 && "s"}
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {filteredUser.length === 0 ? (
          <p className="text-white">Aucun membre trouvé.</p>
        ) : (
          filteredUser.map((user) => (
            <li key={user.idUser as string} className="w-full border rounded-md p-4 text-center">
              <div className="w-32 h-32 mx-auto bg-white rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src={user?.image ? user.image as string : '/images/default-avatar.png'}
                  alt={user?.firstName as string}
                  width={900}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="my-2 p-2">
                <h4 className="text-md font-bold text-white line-clamp-2 mb-1">{user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : 'Utilisateur'}</h4>
                {user?.job && <span className="block text-sm italic text-white mb-1">{user?.job}</span>}
                {user?.nbFollowProfil && user?.nbLikeProfile &&
                  <div className="flex items-center justify-center gap-2 text-white mb-3 text-sm italic flex-col">
                    <p className="flex items-center gap-1">
                        <HiMiniUserPlus />
                        <span>{user?.nbFollowProfil} follower{user?.nbLikeProfile > 1 && "s"}</span>
                    </p>
                    <p className="flex items-center gap-1 ">
                      <FaHeart/>
                      <span>{user?.nbLikeProfile} like{user?.nbLikeProfile > 1 && "s"}</span>
                    </p>
                  </div>
                }
                <Link href={`/members/${user.idUser}`}  className="inline-flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white rounded-md text-sm">
                <FaEye/>
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
