export interface SignInAndUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: UserTypeData | null;
  isFetch: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;

}

export interface UserTypeData {
  idUser?: string;
  firstName?: string;
  lastName?: string;
  job?: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  role?: string;
  email?: string;
  description?: string;
  inscription?: Date  | string;
  image?: string;
  background?: string;
  languages?: string[]; 
}

export type PostTypeData = {
  id?: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  postUrl?: string | null;
  authorId?: string ; 
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export interface PostSingleProps {
  userInfos: UserTypeData;  
  postData: PostTypeData;    
}

export interface UserProfileProps {
  userInfos: UserTypeData;
}