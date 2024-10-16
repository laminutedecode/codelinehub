"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/database/firebaseConfig';
import { addUserToMemberCollection } from '@/database/services/authService';
import { AuthContextType, UserTypeData } from '../types/types';

const GoogleProviderAuth = new GoogleAuthProvider();
const GithubProviderAuth = new GithubAuthProvider();

const AuthContextProvider = createContext<AuthContextType | undefined>(undefined);

// Provider du contexte
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserTypeData | null>(null);
  const [isFetch, setIsFetch] = useState(true);
  const router = useRouter();

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData: UserTypeData = {
        idUser: userCredential.user.uid,
        email: userCredential.user.email || undefined,
      };
      setUser(userData);
      await addUserToMemberCollection(userCredential.user);
      router.push("/dashboard/member/profile");
    } catch (error) {
      console.log("Une erreur s'est produite lors de l'inscription", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData: UserTypeData = {
        idUser: userCredential.user.uid,
        email: userCredential.user.email || undefined,
      };
      setUser(userData);
      router.push("/dashboard/member/profile");
    } catch (error) {
      console.log("Erreur lors de la connexion", error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProviderAuth);
      const user = result.user;

      if (user) {
        const userData: UserTypeData = {
          idUser: user.uid,
          email: user.email || undefined,
          image: user.photoURL || undefined,
        };
        await addUserToMemberCollection(user);
        setUser(userData);
        router.push("/dashboard/member/profile");
      }
    } catch (error) {
      console.log("Erreur lors de la connexion avec Google", error);
    }
  };
  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, GithubProviderAuth);
      const user = result.user;

      if (user) {
        const userData: UserTypeData = {
          idUser: user.uid,
          email: user.email || undefined,
          image: user.photoURL || undefined,
        };
        await addUserToMemberCollection(user);
        setUser(userData);
        router.push("/dashboard/member/profile");
      }
    } catch (error) {
      console.log("Erreur lors de la connexion avec Google", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const userData: UserTypeData = {
          idUser: user.uid,
          email: user.email || undefined,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsFetch(false);
    });
    return () => unsubscribe();
  }, []);

  const redirectIfAuthenticated = () => {
    if (user) {
      router.push('/dashboard/member/profile');
    } else {
      router.push('/signInAndSignUp');
    }
  };

  const authValue = { user, isFetch, signUp, signIn, redirectIfAuthenticated, loginWithGoogle, loginWithGithub };

  return (
    <AuthContextProvider.Provider value={authValue}>
      {children}
    </AuthContextProvider.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useContextAuth = () => {
  const AuthContext = useContext(AuthContextProvider);
  if (!AuthContext) {
    throw new Error('useContextAuth must be used within an AuthProvider');
  }
  return AuthContext;
};
