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
  nbLikeProfile?: number;
  usersLike?: string[];
  nbFollowProfil?: number;
  usersFollow?: string[];
  usersLikePost?: string[];
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
  usersLikePost?: string[];
};

export interface PostSingleProps {
  userInfos: UserTypeData;  
  postData: PostTypeData;    
  id?:string;
}

export interface UserProfileProps {
  id?: string;
  userInfos: UserTypeData;
}

export interface CountDashboardProps {
  id: string;
  postsCount: number;
}

export interface ChatType {
  chatId: string;
  userSend: string; 
  userReciper: string; 
  otherUserName: string;
  otherUserPhoto: string;
  updatedAt: number; 
  createdAt: number; 
  status: string; 
  lastMessageSender: string; 

  archived: boolean; 
  nameUserSend: string; 
  nameUserReciper: string; 
}

export interface MessageType {
  id: string;
  text: string;
  nameUserSend: string;
  nameUserReciper: string;
  idUserSend: string;
  idUserReciper: string;
  imageUserSend: string;
  imageUserReciper: string;
  createdAt: number;
  updatedAt: number;
}