"use client";

import Loader from "@/app/components/Loader";
import { jobsList, languages } from "@/data/data";
import { useContextAuth } from '@/contexts/AuthContext';
import { UpdateUserSchema } from "@/schemas/schemas";
import { UserTypeData } from "@/types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';



export default function EditPageUser() {
  const { user } = useContextAuth();
  const { register, handleSubmit, setValue, getValues } = useForm<UserTypeData>({
    resolver: yupResolver(UpdateUserSchema),
  });

  const [userInfos, setUserInfos] = useState<UserTypeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.idUser) {
          const response = await fetch(`/api/users/getUser?id=${user.idUser}`, {
            method: 'GET',
          });
  
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des informations utilisateur.');
          }
  
          const fetchedUserInfos = await response.json();
          setUserInfos(fetchedUserInfos);
  
          if (fetchedUserInfos) {
            setValue("firstName", fetchedUserInfos.firstName || "");
            setValue("lastName", fetchedUserInfos.lastName || "");
            setValue("job", fetchedUserInfos.job || "");
            setValue("description", fetchedUserInfos.description || "");
            setValue("githubUrl", fetchedUserInfos.githubUrl || "");
            setValue("youtubeUrl", fetchedUserInfos.youtubeUrl || "");
            setValue("websiteUrl", fetchedUserInfos.websiteUrl || "");
            setValue("instagramUrl", fetchedUserInfos.instagramUrl || "");
            setValue("image", fetchedUserInfos.image || "");
            setValue("background", fetchedUserInfos.background || "");
            setValue("languages", fetchedUserInfos.languages || []); 
          }
        }
      } catch (err) {
        setError('Erreur lors de la récupération des informations utilisateur.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [user?.idUser]);
  
  const onSubmit = async (data: UserTypeData) => {
    try {
      let userImgProfile = data.image || "";
      let userImgBackground = data.background || "";
      setIsUploading(true);
  
      const oldImage = userInfos?.image;
      const oldImageBackground = userInfos?.background;
  
      const storage = getStorage();
  
      // Vérifie si une nouvelle image de profil est fournie
      if (imageFile) {
        if (oldImage && !oldImage.includes('googleusercontent.com') && !oldImage.includes('githubusercontent.com')) {
          // Suppression de l'ancienne image de profil
          const oldImageRef = ref(storage, oldImage);
          await deleteObject(oldImageRef);
        }
  
        const storageRef = ref(storage, `usersImages/${imageFile.name}${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        userImgProfile = await getDownloadURL(storageRef);
      }
  
      // Vérifie si une nouvelle image de fond est fournie
      if (backgroundFile) {
        if (oldImageBackground) {
          // Suppression de l'ancienne image de fond
          const oldImageBackgroundRef = ref(storage, oldImageBackground);
          await deleteObject(oldImageBackgroundRef);
        }
  
        const storageRef = ref(storage, `backgroundImages/${backgroundFile.name}${Date.now()}`);
        await uploadBytes(storageRef, backgroundFile);
        userImgBackground = await getDownloadURL(storageRef);
      }
  
      // Appel à la route PUT pour mettre à jour les informations utilisateur
      const response = await fetch('/api/users/updatedUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUser: userInfos?.idUser,
          firstName: data.firstName,
          lastName: data.lastName,
          job: data.job,
          description: data.description,
          websiteUrl: data.websiteUrl,
          youtubeUrl: data.youtubeUrl,
          instagramUrl: data.instagramUrl,
          githubUrl: data.githubUrl,
          image: userImgProfile,
          background: userImgBackground,
          languages: data.languages,
          currentUserId: userInfos?.idUser,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des informations utilisateur.');
      }
  
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error("Erreur:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-white">
        <h2 className="uppercase font-black text-2xl text-center">{error}</h2>
      </div>
    );
  }
  
  

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-white">
        <h2 className="uppercase font-black text-2xl text-center">{error}</h2>
      </div>
    );
  }



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full border p-8 rounded-md text-white">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full flex flex-col space-y-1">
          <h1 className="w-full text-xl md:text-4xl uppercase font-black">Paramètres</h1>
        </div>

        <div className="w-full mb-2 flex flex-col space-y-2">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Aperçu de l'image de profil"
              width={100}
              height={100}
              priority
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            userInfos?.image && (
              <Image
                src={userInfos?.image || "/images/default-avatar.png"}
                alt="Profile picture"
                width={100}
                height={100}
                priority
                className="w-24 h-24 rounded-full object-cover"
              />
            )
          )}
      
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
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full mb-4 flex flex-col space-y-2">
          <label className="text-gray-300">Nom:</label>
          <input
            {...register("lastName")}
            type="text"
            className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
        </div>

        <div className="w-full mb-4 flex flex-col space-y-2">
          <label className="text-gray-300">Prénom:</label>
          <input
            {...register("firstName")}
            type="text"
            className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full mb-4 flex flex-col space-y-2">
          <label className="text-gray-300">E-mail:</label>
          <input
            {...register("email")}
            type="email"
            defaultValue={userInfos?.email}
            disabled
            className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
        </div>

        <div className="w-full mb-4 flex flex-col space-y-2">
          <label className="text-gray-300">Job:</label>
          <select
            {...register("job")}
            className="border p-2 rounded-md bg-transparent outline-none text-white"
          >
            {jobsList.map((job) => (
              <option key={job.value} className="text-gray-500" value={job.value}>
                {job.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full mb-4 flex flex-col space-y-2">
          <label className="text-gray-300">Site web:</label>
          <input
            {...register("websiteUrl")}
            type="url"
            className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
        </div>
        <div className="w-full mb-4 flex flex-col space-y-2">
          <label className="text-gray-300">Youtube URL:</label>
          <input
            {...register("youtubeUrl")}
            type="url"
           className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full mb-2 flex flex-col space-y-2">
          <label className="text-gray-300">GitHub URL</label>
          <input
            {...register("githubUrl")}
            type="url"
            className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
        </div>
        <div className="w-full mb-2 flex flex-col space-y-2">
          <label className="text-gray-300">Instagram URL</label>
          <input
            {...register("instagramUrl")}
            type="url"
          className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
        </div>
      </div>
     
      <div className="mb-4 flex flex-col space-y-2">
        <label   className="text-gray-300">Langages:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {languages.map((language) => (
            <div key={language.value} className="flex items-center">
              <input
                {...register("languages")}
                id={language.label}
                type="checkbox"
                value={language.value}
                className="form-checkbox h-5 w-5 text-purple-600 border-gray-300 rounded  accent-purple-500"
                onChange={({ target }) => {
                  const currentLanguages = getValues("languages") || [];
                  if (target.checked) {
                    setValue("languages", [...currentLanguages, target.value]);
                  } else {
                    setValue("languages", currentLanguages.filter((lang: string) => lang !== target.value));
                  }
                }}
              />
              <label htmlFor={language.label} className="ml-2 text-gray-200 text-sm cursor-pointer hover:text-purple-400 ">{language.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2 flex flex-col space-y-2">
        <label className="text-gray-300">Description:</label>
        <textarea
          {...register("description")}
          className="border h-[150px] p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
        />
      </div>

      <div className="w-full mb-2 flex flex-col space-y-2">
      <label className="text-gray-300">Background:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                setBackgroundFile(file);
                setBackgroundPreview(URL.createObjectURL(file));
              }
            }}
            className="cursor-pointer"
          />

        {backgroundPreview ? (
            <Image
              src={backgroundPreview}
              alt="Aperçu de l'image de background"
              width={90}
              height={600}
              priority
              className="max-w-[900px] mx-auto w-full h-full object-cover"
            />
          ) : (
            userInfos?.background && (
              <Image
                src={userInfos?.background || "/images/default-avatar.png"}
                alt="Background picture"
                width={900}
                height={600}
                priority
                className="max-w-[900px] mx-auto w-full h-full object-cover"
              />
            )
          )}
        </div>
    

      <div className="flex justify-end mt-6">
        <button 
          type="submit" 
          className={`inline bg-purple-800 hover:bg-purple-500 px-3 py-1.5 text-white my-3 rounded-md ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? "Mise à jour en cours..." : "Mettre à jour"}
        </button>
      </div>
    </form>
  );
}
