"use client";
import ButtonRS from '@/app/components/members/ButtonsRS';
import CardProfileUser from "@/app/components/members/MemberCard";
import { useContextAuth } from "@/contexts/AuthContext";
import { UserProfileProps } from "@/types/types";
import Link from "next/link";
import { IoChatbubbleEllipses } from "react-icons/io5";
import ButtonAction from "./ButtonsActions";


export default function MemberHeader({ userInfos,id }: UserProfileProps) {

  const {user} = useContextAuth();

  return (
      <div
        className="relative h-full w-full bg-fixed bg-center bg-cover border-b"
        style={{ backgroundImage: `url('${userInfos?.background ? userInfos.background as string : '/images/default-bg.jpg'}')` }}
      >

        <div className="absolute inset-0 bg-black opacity-80"></div>

        <div className="relative text-left p-6 w-full h-full">
         
            {user && (
    
          <div className="absolute top-6 right-6 flex items-center gap-2">
              <Link
                  href={`/dashboard/member/chats/${[id, user?.idUser].sort().join('-')}`}
                  className="flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md"
                  >
                <IoChatbubbleEllipses />
              </Link>
              <ButtonAction idUserProfile={id as string} action="like" />
              <ButtonAction idUserProfile={id as string} action="follow" />
          </div>
            )}  

          <CardProfileUser userInfos={userInfos} />

          <div className="absolute bottom-6 right-6">
            <ButtonRS userInfos={userInfos}/>           
          </div>           

        </div>
      </div>   
  );
}
