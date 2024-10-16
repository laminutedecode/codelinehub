"use client";

import Image from "next/image";
import Link from "next/link";
import { UserTypeData } from "@/database/types/types";
import { useEffect, useState } from "react";
import useAdmin from "@/database/hooks/useAdmin";
import Loader from "@/app/components/Loader";

export default function UsersPage() {
  const { members, loading } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");

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

  if (loading) {
    return <Loader />;
  }

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
              <Image src={user?.image as string} alt={user?.firstName as string} width={900} height={600} className="w-32 h-32 block mx-auto rounded-full" />
              <div className="my-2 p-2">
                <h4 className="text-md font-bold text-white line-clamp-2 mb-2">{user?.firstName} {user?.lastName}</h4>
                <span className="block text-sm italic text-white mb-3">{user?.job}</span>
                <Link href={`/profile/${user.idUser}`} className="text-sm text-purple-500 hover:text-purple-800">
                  Voir profil
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
