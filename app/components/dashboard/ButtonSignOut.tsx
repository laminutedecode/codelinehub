"use client"
import { auth } from "@/database/firebaseConfig"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { IoLogOut } from "react-icons/io5";

export default function ButtonSignOut() {

  const router = useRouter()

  const handleSignOut = ()=> {
    signOut(auth)
    .then(()=> console.log('Deconnexion'))
    .catch((error)=> console
    .error(error))
    router.push('/')
  }

  return (
        <button onClick={handleSignOut} className="flex items-center gap-2  bg-red-500 hover:bg-red-700 px-3 py-1.5 text-white rounded ml-auto md:mt-6 md:ml-0">
          <IoLogOut/>
          <span className="hidden lg:block">Deconnexion</span>
        </button>
    )
}
