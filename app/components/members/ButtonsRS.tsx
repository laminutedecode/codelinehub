import { UserProfileProps } from '@/types/types'
import { CgWebsite } from "react-icons/cg";
import { FaGithub, FaInstagramSquare, FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function ButtonsRS({userInfos}: UserProfileProps) {

  const userReseaux = [
    { name: "Instagram", url: userInfos.instagramUrl, icon: FaInstagramSquare },
    { name: "Website", url: userInfos.websiteUrl, icon: CgWebsite },
    { name: "Youtube", url: userInfos.youtubeUrl, icon: FaYoutube },
    { name: "Github", url: userInfos.githubUrl, icon: FaGithub },
  ];

  return (
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
  )
}
