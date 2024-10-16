import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/database/utils/formatDate";
import { UserTypeData, PostTypeData } from "@/database/types/types";

interface HeaderPostProps {
  userInfos: UserTypeData;  
  postData: PostTypeData;    
}

export default function HeaderPost({ userInfos, postData }: HeaderPostProps) {  
  return (
    <div className="max-w-[1200px] mx-auto  h-full w-full">
      <div
        className="relative  h-[500px] bg-fixed bg-center bg-cover md:border-l md:border-r"
        style={{ backgroundImage: `url('${postData.image}')` }} 
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="relative z-[50] text-left p-6 w-full h-full">
          <h1 className=" text-lg md:text-xl font-bold text-white break-words">
            {postData.title}  
          </h1>
          <p className="text-white text-sm">
            Publié par <Link className="text-purple-500" href={`/profile/${userInfos.idUser}`}>{userInfos.firstName} {userInfos.lastName}</Link> le {formatDate(postData.createdAt)}
          </p>
        </div> 
      </div>
    </div>
  );
}
