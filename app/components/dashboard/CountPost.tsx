import { MdArticle } from "react-icons/md";
import Link from "next/link";

interface CountPostProps {
  postsCount: number;
}

export default function CountPost({ postsCount }: CountPostProps) {
  const countsUser = [
    {
      label: "NB de posts",
      count: postsCount,
      icon: MdArticle,
      path: "/dashboard/member/posts",
      labelBtn: "Voir les posts",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      <ul>
        {countsUser.map((count, index) => (
          <li
            key={index}
            className="border rounded-md flex items-center justify-center flex-col gap-2 p-2 py-4"
          >
            <count.icon className="w-8 h-8" />
            <span>{count.label}</span>
            <span className="font-black text-4xl">{count.count}</span>
            <Link
              href={count.path}
              className="flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md"
            >
              {count.labelBtn}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
