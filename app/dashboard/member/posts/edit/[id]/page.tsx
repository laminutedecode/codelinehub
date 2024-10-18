"use client";

import { useEffect, useState } from "react";
import { useContextAuth } from '@/database/contexts/AuthContext';
import { yupResolver } from "@hookform/resolvers/yup";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { languages } from "@/database/data/data";
import { PostsSchema } from "@/database/schemas/schemas";
import { PostTypeData } from "@/database/types/types";
import Loader from "@/app/components/Loader";
import ButtonBack from "@/app/components/ButtonBack";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams(); 
  const { user } = useContextAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PostTypeData>({
    resolver: yupResolver(PostsSchema),
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageOldFile, setOldImageFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPostData = async () => {
        try {
          const response = await fetch(`/api/posts/getPostById`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id}), 
          });
          if (!response.ok) throw new Error('Erreur lors de la récupération du post');

          const post = await response.json();
          if (post) {
            setValue("title", post.title);
            setValue("description", post.description);
            setValue("category", post.category);
            setValue("postUrl", post.postUrl || "");
            setImagePreview(post.image);
            setOldImageFile(post.image);
          }
        } catch (error) {
          console.error("Erreur lors du chargement du post:", error);
          toast.error('Erreur lors du chargement du post');
        } finally {
          setLoading(false);
        }
      };

      fetchPostData();
    } else {
      setLoading(false);
    }
  }, [id, setValue]);

  const onSubmit = async (data: PostTypeData) => {
    try {
      let postImg = imagePreview || "";
      const oldImage = imageOldFile;
      const storage = getStorage();

      setIsUploading(true);

      if (imageFile) {
        if (oldImage) {
          const oldImageRef = ref(storage, oldImage);
          await deleteObject(oldImageRef);
        }
        const storageRef = ref(storage, `postsImages/${imageFile.name}${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        postImg = await getDownloadURL(storageRef);
      }

      const response = await fetch(`/api/posts/updatedPost`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id, 
          title: data.title,
          description: data.description,
          category: data.category,
          postUrl: data.postUrl,
          image: postImg,
          authorId: user?.idUser as string,
          updatedAt: new Date(),
          currentUserId: user?.idUser,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour du post');

      toast.success('Post mis à jour avec succès');
      router.push('/dashboard/member/posts');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du post');
      console.error("Erreur:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full border p-8 rounded-md text-white">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full space-y-1 mb-4">
          <h1 className="w-full text-xl md:text-4xl uppercase font-black">Editer post</h1>
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
          className="border h-[250px] p-3 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
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
          {isUploading ? "Mise à jour en cours..." : "Modifier le post"}
        </button>
      </div>
    </form>
  );
}
