import { fetcher } from "@/utils/api/fetch";
import { LIKE_API } from "@/utils/api/like";
import { CardData } from "@/utils/interface";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
import useSWR from "swr";
import logoImg from "@/assets/taillogo.png";
import AIDetailsPopup from "./AIDetailsPopup";

interface TodayCardProps {
  item: CardData,
  index: number,
  user_address: string,
  toggleLike: (user_address: string, ai_id: string, like: boolean, mutate: any) => {}
}

const TodayCard: React.FC<TodayCardProps> = ({item, index, user_address, toggleLike}) => {
  const router = useRouter();
  const { data: like, mutate } = useSWR(`${LIKE_API.AI_LIKE(user_address, item.id)}`, fetcher);
  const [isOpen, setIsOpen] = useState(false);

  const handleChatClick = (e: React.MouseEvent, item: CardData) => {
    e.stopPropagation();
    router.push(`/ai/${item.id}/chat`);
  };

  return(
    <div key={item.id}>
      <Dialog
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <div className="p-4 cursor-pointer">
            <div className="bg-gradient-custom rounded-3xl overflow-hidden relative">
              <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-90 text-emerald-500 text-xl font-bold py-1 px-3 rounded-full">
                #{index + 1}
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(user_address, item.id, like, mutate);
                    console.log(e);
                  }}
                >
                  <Heart
                    color={like && like ? "#F75555" : "white"}
                    fill={like && like ? "#F75555" : "none"}
                    size={24}
                  />
                </button>
              </div>
              <div className="px-6 py-10 pt-12">
                {item.profile_image_url ? (
                  <div className="w-32 h-32 bg-sky-200 rounded-full mx-auto mb-4 relative overflow-hidden">
                    <Image
                      src={item.profile_image_url}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 flex items-center justify-center mb-4">
                    <Image
                      src={logoImg}
                      alt="Default Logo"
                      width={128}
                      height={128}
                      className="object-contain transform translate-x-3"
                    />
                  </div>
                )}
                <h3 className="text-white text-2xl font-bold text-center mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.name}
                </h3>
                <p className="text-gray-300 text-center mb-4">
                  {item.creator || "Creator Name"}
                </p>
                <div className="flex justify-center">
                  <button
                    className="bg-[#35383F] bg-opacity-70 text-primary-900 py-2 px-6 rounded-full hover:bg-opacity-80 transition duration-300 flex items-center"
                    onClick={(e) => handleChatClick(e, item)}
                  >
                    Chat <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogTrigger>
        {isOpen && (
          <DialogContent>
            <DialogTitle />
            <AIDetailsPopup ai_detail={item} />
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
export default TodayCard;