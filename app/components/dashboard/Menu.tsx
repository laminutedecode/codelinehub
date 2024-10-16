'use client';
import { checkAdminRole } from "@/database/services/services";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ButtonSignOut from "./ButtonSignOut";
import { useContextAuth } from "@/database/contexts/AuthContext";
import { useEffect, useState } from "react";
import { FaUserAlt, FaUserShield } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { IoIosSettings,IoIosChatbubbles } from "react-icons/io";



export default function DashboardMenu() {
  const pathname = usePathname();
  const { user } = useContextAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user?.idUser) {
        const adminStatus = await checkAdminRole(user.idUser as string);
        setIsAdmin(adminStatus);
      }
    };

    verifyAdmin();
  }, [user?.idUser]);

  const menuDashboard = [
    { name: "Profil", icon: FaUserAlt, path: "/dashboard/member/profile" },
    { name: "Posts", icon: MdArticle, path: "/dashboard/member/posts" },
    { name: "Chats", icon: IoIosChatbubbles, path: "/dashboard/member/chats" },
    { name: "Paramètres", icon: IoIosSettings, path: "/dashboard/member/settings" },
  ];
  
  const menuDashboardAdmin = [
    { name: "Profil", icon: FaUserAlt, path: "/dashboard/member/profile" },
    { name: "Posts", icon: MdArticle, path: "/dashboard/member/posts" },
    { name: "Chats", icon: IoIosChatbubbles, path: "/dashboard/member/chats" },
    { name: "Paramètres", icon: IoIosSettings, path: "/dashboard/member/settings" },
    { name: "Admin", icon: FaUserShield, path: "/dashboard/admin/users" },
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
