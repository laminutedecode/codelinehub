'use client';

import Loader from "@/app/components/Loader";
import { useContextAuth } from '@/database/contexts/AuthContext';
import useAdmin from "@/database/hooks/useAdmin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { toast } from "react-toastify";

const UsersList = () => {
  const router = useRouter();
  const { isUserAdmin, deleteUser } = useAdmin(); 
  const { user } = useContextAuth(); 
  const { members, loading, error } = useAdmin();
  
  const [searchQuery, setSearchQuery] = useState(""); 
  
  const isAdmin = isUserAdmin(user?.idUser as string);

  if (loading) {
    return <Loader />;
  }

  if (!isAdmin || error) {
    router.push('/dashboard/member/profile');
  }


  const handleDelete = async (userId: string) => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (confirmDelete) {
      await deleteUser(userId);
      toast.success("Utilisateur supprimé avec succès.");
      router.push('/dashboard/member/profile');
    }
  };

 
  const filteredMembers = members.filter((member) =>
    `${member.firstName || ""} ${member.lastName || ""}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="w-full text-xl md:text-4xl uppercase font-black mb-6 text-white">Liste des utilisateurs</h1>


      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          className="w-full h-10 border border-gray-300 rounded p-4 outline-none bg-transparent focus:ring-purple-500 text-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <p className="text-sm text-white text-center mt-2">
          Total: {filteredMembers.length} utilisateur{filteredMembers.length > 1 && "s"}
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Nom</th>
              <th className="px-4 py-2 border">Rôle</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.email || member.idUser} className="border-b">
                <td className="px-4 py-2 border">
                 
                    <img
                    src={member?.image ? member.image as string : '/images/default-avatar.png'}
                      alt={`${member.firstName || "Utilisateur"} ${member.lastName || ""}`}
                      className="w-12 h-12 rounded-full object-cover block mx-auto"
                    />
                
                </td>
                <td className="px-4 py-2 border text-center">
                  {member.firstName || ""} {member.lastName || ""}
                </td>
                <td className="px-4 py-2 border text-center">{member.role || "N/A"}</td>
                <td className="px-4 py-2 border text-center">{member.email || "N/A"}</td>
                <td className="flex items-center justify-center gap-2 p-2">
                  <Link
                    href={`/profile/${member.idUser}`}
                    className="bg-green-500 hover:bg-green-800 px-3 py-1.5 text-white rounded-md"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    href={`/dashboard/admin/edit/${member.idUser}`}
                    className="bg-yellow-500 hover:bg-yellow-800 px-3 py-1.5 text-white rounded-md"
                  >
                    <MdEditSquare />
                  </Link>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-800 px-3 py-1.5 text-white rounded-md"
                    onClick={() => handleDelete(member.idUser as string)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
