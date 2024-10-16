'use client';
import useAdmin from "@/database/hooks/useAdmin";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserAlt, FaUserShield } from "react-icons/fa";
import ButtonSignOut from "./ButtonSignOut";
import { useContextAuth } from "@/database/contexts/AuthContext";
import { MdArticle } from "react-icons/md";

export default function DashboardMenu() {
  const pathname = usePathname();
  const { isUserAdmin } = useAdmin(); 
  const { user } = useContextAuth(); 

  const isAdmin = isUserAdmin(user?.idUser as string);

  const menuDashboard = [
    { name: "Profil", icon: FaUserAlt, path: "/dashboard/member/profile" },
    { name: "Posts", icon: MdArticle, path: "/dashboard/member/posts" },
  ];
  
  
  
  const menuDashboardAdmin = [
    { name: "Votre profil", icon: FaUserAlt, path: "/dashboard/member/profile" },
    { name: "Posts", icon: MdArticle, path: "/dashboard/member/posts" },
    
    { name: "Admin", icon: FaUserShield , path: "/dashboard/admin/users" },
  ];


  const menuToDisplay = isAdmin ? menuDashboardAdmin : menuDashboard;

  return (
    <nav className="flex md:flex-col  md:w-16 w-full lg:w-60 gap-2 flex-wrap border-b md:border-b-none md:border-r border-gray-300 p-2 text-white">
      {menuToDisplay.map((link, index) => {
        const isActive = pathname.startsWith(link.path);
        return (
          <Link href={link.path} key={index} passHref>
            <div className={`flex items-center justify-center lg:justify-start gap-2 cursor-pointer p-3 hover:text-purple-500 text-sm font-bold rounded-md ${isActive && "text-purple-500"}`}>
              <link.icon className='w-4' />
              <span className="hidden lg:block">{link.name}</span>
            </div>
          </Link>
        );
      })}

      <ButtonSignOut />
    </nav>
  );
}
