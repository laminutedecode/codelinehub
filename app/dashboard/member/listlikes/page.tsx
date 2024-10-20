"use client"
import { useEffect, useState } from 'react';
import Loader from '@/app/components/Loader';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa';
import { PostTypeData } from '@/types/types';
import { useContextAuth } from '@/contexts/AuthContext';

export default function LikedPosts() {
  const [posts, setPosts] = useState<PostTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 

  const { user } = useContextAuth();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!user) {
        setLoading(false);
        return; 
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/posts/getPostsUserLike?userId=${user.idUser}`);
        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts || []);
        } else {
          console.error("Erreur:", data.error);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des posts likés:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [user]);

 
  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <div className="max-w-[1200px] mx-auto w-full pt-4 px-6">
      {loading ? (
        <Loader />
      ) : (
        <>
          <input
            type="text"
            placeholder="Rechercher par titre ou par mot-clé..."
            className="w-full mb-4 h-10 border border-gray-300 rounded p-4 outline-none bg-transparent focus:ring-purple-500 text-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />

          <p className="text-md text-white pb-2 mb-2">{filteredPosts.length} Post{filteredPosts.length > 1 ? 's' : ''} aimé{filteredPosts.length > 1 ? 's' : ''}:</p>

          {filteredPosts.length === 0 ? (
            <p className="text-white">Aucun post trouvé.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {filteredPosts.map((postData) => (
                <li key={postData.id} className="w-full border rounded-md overflow-hidden">
                  <Image 
                    src={postData.image as string} 
                    alt={`${postData.title}`} 
                    width={300} 
                    height={100} 
                    className="w-full object-cover" 
                  />
                  <div className="my-2 p-2">
                    <h2 className="text-md font-bold text-white line-clamp-2 mb-2">{postData.title}</h2>
                    <div className="flex justify-end items-center gap-2">
                      <Link href={`/posts/${postData.id}`} className="bg-green-500 hover:bg-green-800 px-3 py-1.5 text-white rounded-md">
                        <FaEye />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
