import { useRouter } from "next/navigation"
import { FaArrowLeft } from "react-icons/fa6";

export default function ButtonBack() {
  const router = useRouter()
  function handleBack() {
    router.back()
  }

  return (
    <button type="button"  className="flex items-center gap-2 bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md" onClick={handleBack}>
      <FaArrowLeft/>
      <span>Retour</span>
    </button>
  )
}
