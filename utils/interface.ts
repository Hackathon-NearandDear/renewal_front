import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
  title: string;
}

export interface HeaderBarProps {
  title: string;
  userProfileUrl?: string;
  onMenuClick?: () => void;
}

// AI related inteface
export interface AICardProps {
  item: CardData;
}

export interface LogProps {
  rag_id: number;
  ai_id: string;
  created_at: string;
  comments: string;
  tx_url: string;
  faiss_id: string;
}

export interface AIDetailProps {
  id: string;
  creator_address: string;
  created_at: string;
  name: string;
  profile_img_url: string;
  category: string;
  introductions: string;
  total_token_usage: number;
  earnings: number;
  chat_count: number;
  logs: LogProps[];
}

export interface AIData {
  id: string;
  name: string;
  category: string;
  introductions: string;
  contents: string;
  logs: string;
}

export interface AIModel {
  id: string;
  name: string;
  creator: string;
  image: string;
  category: string;
  introductions: string;
  usage: number;
  total_usage: number;
  ratio: number;
  collect: number;
}

// Chat related Interface

export interface ChatCardProps {
  chatid?: string;
  aiid: string;
  title: string;
  category: string;
  imageSrc?: string;
}

export interface ChatModel {
  chatid: string;
  aiid: string;
  userid: string;
}

export interface ChatWithDetails extends ChatModel {
  aiDetails: AIDetailProps | null;
}

export interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  id: string;
  chat_id: string;
  created_at: string;
  sender_id: string;
  message: string;
}

export interface CardData {
  earnings: number;
  aiId: any;
  id: string;
  name: string;
  creator_address: string;
  creator: string;
  like: boolean;
  category: string;
  profile_image_url: string;
  introductions: string;
  chat_count: number;
  created_at: string;
  daily_user_access: number;
  total_completion_token_usage: number;
  total_prompt_token_usage: number;
  total_token_usage: number;
  rags: any;
  examples: string;
}

export interface User {
  user_address: string;
  nickname: string;
  profile_image_url: string;
  gender: string;
  country: string;
  interest: string;
  // trial: number;
}
