import { UserTypeData } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

interface ProfileCardProps {
  userInfos: UserTypeData | null;
}

export default function ProfileCard({ userInfos }: ProfileCardProps) {
  return (
    <div
      className="relative w-full border p-4 rounded-md flex items-center justify-between bg-center bg-cover md:border-l md:border-r border-b overflow-hidden"
      style={{
        backgroundImage: `url('${userInfos?.background ? userInfos.background : '/images/default-bg.jpg'}')`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80"></div>
      <div className="relative mt-4 text-sm">
        <h3 className="font-bold mb-2">
          {userInfos?.firstName} {userInfos?.lastName}
        </h3>
        <p className="mb-2">
          <b>Job:</b> {userInfos?.job ? userInfos?.job : "Non renseigné"}
        </p>
        <p className="mb-2">
          <b>Email:</b> {userInfos?.email ? userInfos?.email : "Non renseigné"}
        </p>
        <Link
          href="/dashboard/member/settings"
          className="inline-flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md"
        >
          Modifier le profil
        </Link>
      </div>
    
        <Image
          src={userInfos?.image ? userInfos.image as string : '/images/default-avatar.png'}
          alt="User photo profil"
          width={500}
          height={500}
          className="border p-2 relative w-16 h-16 rounded-full"
        />
      
    </div>
  );
}
