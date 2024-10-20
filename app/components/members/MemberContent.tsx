import { UserProfileProps } from "@/types/types";
import MemberGridPost from "@/app/components/members/MemberGridPost";

export default function MemberContent({ userInfos }: UserProfileProps) {
  return (
    <div className="w-full lg:flex items-stretch gap-4 min-h-screen w-ful py-4 px-6">
        <div className="mb-4">
          <h3 className="text-lg  font-bold text-white border-b border-purple-500 pb-2 mb-2">Biographie: </h3>   
          {userInfos?.description ? <p className="text-gray-300 text-md break-words">{userInfos?.description}</p> : <p className="text-gray-500">Non renseigné</p> }
          <MemberGridPost id={userInfos?.idUser as string} /> 
        </div>

        <div className="w-full  lg:w-[500px] lg:border-l px-4">
          <h3 className="text-lg font-bold text-white border-b border-purple-500 pb-2 mb-2">Domaines: </h3>
            <ul className="flex items-center gap-4 flex-wrap mt-4 flex-row lg:flex-col">
              {userInfos?.languages?.length ? (
                userInfos.languages.map((language) => (
                  <li
                    key={language}
                    className="block lg:w-full bg-purple-200 text-purple-500 p-2 rounded-md text-[11px] text-center"
                  >
                    {language}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Non renseigné</li>
              )}
            </ul>
        </div>
      </div>
  )
}
