import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useContextAuth } from "@/contexts/AuthContext";
import { toggleLikePost, getInitialLikeState } from "@/services/postsService";

export default function ButtonLikePost({ idPost }: { idPost: string }) {
  const { user } = useContextAuth();
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const idUserCurrent = user?.idUser as string;

  useEffect(() => {
    const fetchInitialLikeState = async () => {
      if (!idUserCurrent || !idPost) return;

      try {
        const isLiked = await getInitialLikeState(idPost, idUserCurrent);
        setHasLiked(isLiked);
      } catch (error) {
        console.error("Error fetching initial like state:", error);
      }
    };

    fetchInitialLikeState();
  }, [idUserCurrent, idPost]);

  const handleLikeToggle = async () => {
    if (!idUserCurrent || !idPost) return;

    setLoading(true);

    try {
      const newLikeState = await toggleLikePost(idPost, idUserCurrent);
      setHasLiked(newLikeState as boolean);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLikeToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 text-white my-3 rounded-md ${
        hasLiked ? "bg-red-800" : "bg-red-800 bg-opacity-10 hover:bg-red-800"
      }`}
    >
      <FaHeart />
    </button>
  );
}
