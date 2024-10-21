import { formatDate } from "@/utils/formatDate";
import { PostSingleProps } from "@/types/types";
import Link from "next/link";
import { GrUpdate } from "react-icons/gr";

export default function PostContent({ userInfos, postData }: PostSingleProps) {
  return (
    <div className="max-w-[1200px] mx-auto md:border-l md:border-r px-6 pb-6">

      <div className="flex items-center justify-between pt-6 mb-4">
        <p className="bg-purple-200 text-purple-500 p-2 rounded-md text-sm">{postData?.category}</p>
        <p className="text-sm flex items-center justify-end gap-2 text-gray-300">
          <GrUpdate />
          <span>
            Mise à jour le {postData.updatedAt ? formatDate(postData.updatedAt) : "Date inconnue"}
          </span>
        </p>
      </div>

      <h3 className="text-lg md:text-xl font-bold text-white border-b border-purple-500 pb-2 mb-2">Description: </h3>

      <p className="text-gray-300 break-words">{postData?.description}</p>

      {postData?.postUrl && (
        <Link
          target="_blank"
          href={postData.postUrl}
          className="inline-flex items-center ml-auto gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md"
        >
          Voir le projet
        </Link>
      )}

    </div>
  );
}
