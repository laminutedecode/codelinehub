import { useContextAuth } from "@/database/contexts/AuthContext";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function ButtonsAuthProvider() {

  const {loginWithGoogle, loginWithGithub } = useContextAuth();
  
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
    <button
      onClick={loginWithGoogle}
      type="button"
      className="bg-gray-200 hover:bg-gray-300  text-gray-800 flex items-center gap-2 rounded-md  p-2"
    >
      <FaGoogle />
      <span className="hidden md:block">Connexion via Google</span>
    </button>
    <button
      onClick={loginWithGithub}
      type="button"
      className="bg-gray-200 hover:bg-gray-300  text-gray-800 flex items-center gap-2 rounded-md p-2"
    >
      <FaGithub />
      <span className="hidden md:block">Connexion via GitHub</span>
    </button>
  </div>
  )
}
