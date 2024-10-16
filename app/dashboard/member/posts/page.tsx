"use client";
import { CiCirclePlus } from "react-icons/ci";
import { useContextAuth } from '@/database/contexts/AuthContext';
import GridPostUserDashboard from "@/app/components/dashboard/GridPostUserDashboard";
import Link from 'next/link';


export default function PostsUserDashboard() {
  const { user } = useContextAuth();
  return (

    <>
        <Link href="/dashboard/member/posts/create" type="button"  className="inline-flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md" >
      <CiCirclePlus />
      <span>Créer un post</span>
    </Link>
    
    <GridPostUserDashboard id={user?.idUser as string} />
    </>
  );
}
