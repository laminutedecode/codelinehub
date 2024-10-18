"use client";

import { FaGithub, FaYoutube, FaInstagramSquare } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import Image from "next/image";
import Link from "next/link";
import { UserProfileProps } from "@/database/types/types";


export default function HeaderUserProfile({ userInfos }: UserProfileProps) {

  const userReseaux = [
    { name: "Instagram", url: userInfos.instagramUrl, icon: FaInstagramSquare },
    { name: "Website", url: userInfos.websiteUrl, icon: CgWebsite },
    { name: "Youtube", url: userInfos.youtubeUrl, icon: FaYoutube },
    { name: "Github", url: userInfos.githubUrl, icon: FaGithub },
  ];

  return (
    <div className="h-full w-full">

      <div
        className="relative max-w-[1200px] h-[500px] mx-auto bg-fixed bg-center bg-cover md:border-l md:border-r border-b"
        style={{ backgroundImage: `url('${userInfos?.image ? userInfos.image as string : '/images/default-bg.jpg'}')` }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="relative text-left p-6 w-full h-full">
          {userInfos.firstName && userInfos.lastName ?(
            <h1 className="text-2xl md:text-4xl font-bold text-white break-words">
              {userInfos.firstName} {userInfos.lastName}
            </h1>
          ) : (
            <h1 className="text-2xl md:text-4xl font-bold text-white break-words">
              Non renseigné
            </h1>
          )}
          <p className="text-gray-300 font-bold">{userInfos.job}</p>
   

      
              <div className="absolute bottom-6 right-6">
                  <ul className="flex flex-col md:flex-row items-center gap-2">
                  {userReseaux.map((reseau) => (
                    <li key={reseau.name}>
                      <Link
                        href={reseau.url as string}
                        target="_blank"
                        className="flex items-center justify-center w-8 h-8 border text-white hover:bg-white hover:text-gray-900 p-2 rounded-full cursor-pointer"
                      >
                        <reseau.icon />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>           

          <div className="absolute left-6 -bottom-[70px] w-[150px] h-[150px] rounded-full overflow-hidden border bg-white flex items-center justify-center">
          <Image
                src={userInfos?.image ? userInfos.image as string : '/images/default-avatar.png'}
                alt={userInfos?.firstName as string}
                width={500}
                height={500}
                className="w-32 h-32 block mx-auto rounded-full"
                />
          </div>
        </div>
      </div>

      
    </div>
  );
}
