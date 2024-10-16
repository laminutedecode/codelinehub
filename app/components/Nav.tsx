import Link from "next/link"
import { FaUser } from "react-icons/fa";


export default function Nav() {
  return (
    <nav className="h-[50px] w-full bg-[#000000] text-white flex items-center justify-between gap-3 px-5 py-2 border-b">
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:text-purple-500">Home</Link>
          <Link href="/posts" className="hover:text-purple-500">Posts</Link>
          <Link href="/profile" className="hover:text-purple-500">Développeurs</Link>

        </div>
        <div>
         <Link href="/signInAndSignUp"  className="hover:text-purple-500"><FaUser /></Link>
        </div>
    </nav>
  )
}
