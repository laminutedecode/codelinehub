import { UserTypeData } from "@/database/types/types";

interface UserProfileProps {
  userInfos: UserTypeData;
}

export default function InfosUser({ userInfos }: UserProfileProps) {
  return (
    <div className="max-w-[1200px] mx-auto w-full md:border-l md:border-r pt-[100px] px-6">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold text-white border-b border-purple-500 pb-2 mb-2">Biographie: </h3>
          <p className="text-gray-300 text-md break-words">{userInfos?.description}</p>
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-bold text-white border-b border-purple-500 pb-2 mb-2">Langages et outils: </h3>
          <ul className="flex items-center gap-4 flex-wrap mt-4">
            {userInfos?.languages?.length ? (
              userInfos.languages.map((language) => (
                <li
                  key={language}
                  className="bg-purple-200 text-purple-500 p-2 rounded-md text-sm"
                >
                  {language}
                </li>
              ))
            ) : (
              <li className="text-gray-500">Aucun langage spécifié</li>
            )}
          </ul>
        </div>
      </div>
  )
}
