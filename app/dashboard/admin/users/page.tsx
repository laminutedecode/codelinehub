"use client"

import Loader from "@/app/components/Loader";
import { UserTypeData } from "@/types/types";
import { getAuth } from 'firebase/auth';
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { toast } from "react-toastify";

const UsersList = () => {

  const {currentUser} = getAuth();
  const idCurrentUser = currentUser?.uid;


  const [members, setMembers] = useState<UserTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/users/getUsersAll'); 
        if (!response.ok) throw new Error("Erreur lors de la récupération des membres");
        const data = await response.json();
        setMembers(data);
      } catch (err: any) {
        console.error("Error fetching members:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleDelete = async (userId: string) => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (confirmDelete) {
      try {
        const response = await fetch('/api/users/deleteUser', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idUser: userId , currentUserId: idCurrentUser}),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'utilisateur.");
        }

        const data = await response.json();
        toast.success(data.message);
        setMembers(prevMembers => prevMembers.filter(member => member.idUser !== userId));
      } catch (err: any) {
        toast.error(err.message || "Erreur inconnue lors de la suppression de l'utilisateur.");
      }
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
                    src={member?.image ? member.image : '/images/default-avatar.png'}
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
                    href={`/members/${member.idUser}`}
                    className="bg-green-500 hover:bg-green-800 px-3 py-1.5 text-white rounded-md"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    href={`/dashboard/admin/edit/${member?.idUser}`}
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
