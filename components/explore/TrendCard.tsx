import { CaptionsOff, Heart } from "lucide-react";
import { useLikeHandler } from "@/utils/hooks/useLikeHandler";
import logoImg from "@/assets/taillogo.png";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/utils/api/fetch";
import { useUserStore } from "@/store/userStore";
import { addLike, delLike } from "@/utils/api/user";
import { useCallback, useEffect, useReducer, useState } from "react";
import { AI_API } from "@/utils/api/ai";
import { LIKE_API } from "@/utils/api/like";

interface CardProps {
  user_address: string;
  ai_id: string;
  name: string;
  category: string;
  toggleLike: (user_address: string, ai_id: string, like: boolean, mutate: any) => {}
}

const Card: React.FC<CardProps> = ({
  user_address,
  ai_id,
  name,
  category,
  toggleLike,
}) => {
  const { data: like, mutate } = useSWR(`${LIKE_API.AI_LIKE(user_address, ai_id)}`, fetcher);

  return (
    <div className="p-4 bg-[#1F222A] rounded-[16px] shadow-md relative flex flex-col">
      <div className="w-16 mb-4">
        <Image
          src={logoImg}
          alt="Default Logo"
          className="object-contain transform translate-x"
        />
      </div>
      <div className="flex-grow flex flex-col">
        <h3 className="text-sm font-semibold mb-2">{name}</h3>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <button
        className="absolute top-3 right-3"
        onClick={(e)=>{
          e.stopPropagation();
          toggleLike(user_address, ai_id, like, mutate);
        }}
      >
        <Heart
          color={like && like ? "#F75555" : "white"}
          fill={like && like ? "#F75555" : "none"}
          size={24}
        />
      </button>
    </div>
  );
};

export default Card;
