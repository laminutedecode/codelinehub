import { UserProfileProps } from '@/types/types'
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";

export default function MemberCard({userInfos}: UserProfileProps) {
  return (
    <div className='flex flex-col gap-2'>
      <div className="w-32 h-32 rounded-full overflow-hidden bg-white p-1">

       <Image
          src={userInfos?.image ? userInfos.image as string : '/images/default-avatar.png'}
          alt={userInfos?.firstName ? userInfos?.firstName as string : "Photo de profil de l'utilisateur"}
          width={500}
          height={500}
          className="w-hull h-full object-cover rounded-full"
          />
      </div>
      {userInfos.firstName && userInfos.lastName &&
        <h1 className="text-2xl md:text-4xl font-bold text-white break-words upercase">
          {userInfos.firstName} <span className="text-purple-500">{userInfos.lastName}</span>
        </h1> 
      }
      <p className="text-gray-300 font-bold">{userInfos.job}</p>
      <p className="text-gray-300 text-sm flex items-center gap-2">
        <HiMiniUserPlus/>
        <span>{userInfos.nbFollowProfil} Followers</span>
      </p>
      <p className="text-gray-300 text-sm flex items-center gap-2">
          <FaHeart/>
          <span>{userInfos.nbLikeProfile} Likes</span>
      </p>
    </div>
  )
}
