"use client";
import ButtonBack from "@/app/components/ButtonBack";
import { languages } from "@/data/data";
import { useContextAuth } from '@/contexts/AuthContext';
import { PostsSchema } from "@/schemas/schemas";
import { PostTypeData } from "@/types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

export default function CreatePost() {
  const router = useRouter();
  const { user } = useContextAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<PostTypeData>({
    resolver: yupResolver(PostsSchema),
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = async (data: PostTypeData) => {
    try {
      let postImg = "";
  
      setIsUploading(true);
  
      if (imageFile) {
        const storageRef = ref(getStorage(), `postsImages/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        postImg = await getDownloadURL(storageRef);
      }
  

  
      // Appel de la route API pour ajouter le post
      const response = await fetch('/api/posts/createdPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          postUrl: data.postUrl,
          authorId: user?.idUser as string, 
          image: postImg,
          createdAt: new Date(),
          updatedAt: new Date(),
          currentUserId: user?.idUser,
        }
        ),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du post');
      }
  
      toast.success('Post créé avec succès');
      router.push('/dashboard/member/posts');
    } catch (error) {
      toast.error('Erreur lors de la création du post');
      console.error("Erreur:", error);
    } finally {
      setIsUploading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full border p-8 rounded-md text-white">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full mb-4">
          <h1 className="w-full text-xl md:text-4xl uppercase font-black">Créer un post</h1>
          <ButtonBack />
        </div>
      </div>

      <div className="w-full mb-4 flex flex-col space-y-2">
        <label className="text-gray-300">Titre:</label>
        <input
          {...register("title")}
          type="text"
          className="border p-3 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
        />
        {errors.title && <p className="text-red-500 bg-red-100 p-2 my-2 rounded-md">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full mb-4 flex flex-col space-y-2">
          <label className="text-gray-300">Catégorie:</label>
          <select
            {...register("category")}
            className="border p-3 rounded-md bg-transparent outline-none text-white"
          >
            {languages.map((category) => (
              <option key={category.value} className="text-gray-500" value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 bg-red-100 p-2 my-2 rounded-md">{errors.category.message}</p>}
        </div>

        <div className="w-full mb-4 flex flex-col space-y-2">
          <label className="text-gray-300">URL externe:</label>
          <input
            {...register("postUrl")}
            type="url"
            className="border p-3 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
          {errors.postUrl && <p className="text-red-500 bg-red-100 p-2 my-2 rounded-md">{errors.postUrl.message}</p>}
        </div>
      </div>

      <div className="mb-2 flex flex-col space-y-2">
        <label className="text-gray-300">Description:</label>
        <textarea
          {...register("description")}
          className="border h-[250px]  p-3 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
        />
        {errors.description && <p className="text-red-500 bg-red-100 p-2 my-2 rounded-md">{errors.description.message}</p>}
      </div>

      <div className="w-full mb-2 flex flex-col space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0];
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
          className="cursor-pointer"
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Post Image Preview"
            width={900}
            height={600}
            priority
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className={`inline bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? "Création en cours..." : "Créer post"}
        </button>
      </div>
    </form>
  );
}
