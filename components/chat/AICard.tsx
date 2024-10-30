import { CardData } from "@/utils/interface";
import { useRouter } from "next/router";
import { useLikeHandler } from "@/utils/hooks/useLikeHandler";
import Image from "next/image";
import { Heart, Clock, LucideIcon } from "lucide-react";
import { useState } from "react";
import logoImg from "@/assets/taillogo.png";

interface AICardPropsWithIcon {
  item: CardData; // CardData 타입으로 변경
  icon: LucideIcon; // 아이콘 타입으로 LucideIcon을 사용
}

const AICard: React.FC<AICardPropsWithIcon> = ({ item, icon: Icon }) => {
  const router = useRouter();
  const { handleLikeClick } = useLikeHandler(() => router.reload()); // 좋아요 클릭 후 데이터 새로고침
  const [likes, setLikes] = useState(true); // 기본값 설정
  console.log(item.name);
  const handleLike = (e: React.MouseEvent) => {
    handleLikeClick(e, item.id, likes); // item.aiId -> item.id로 변경
    setLikes(!likes);
  };

  return (
    <div
      className="p-4 bg-[#1F222A] rounded-lg flex items-center border border-[#2A2D36] hover:bg-[#2A2D36] cursor-pointer transition-all duration-200"
      onClick={() => router.push(`/ai/${item.id}/chat`)} // item.aiId -> item.id로 변경
    >
      <div className="flex-shrink-0 mr-4">
        {item.profile_image_url ? (
          <Image
            src={item.profile_image_url}
            alt={item.name}
            width={50}
            height={50}
            className="rounded-full"
          />
        ) : (
          <div className="w-[50px] h-[50px] flex items-center justify-center">
            <Image
              src={logoImg}
              alt="Default Logo"
              className="object-contain"

            />
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0 mr-2">
        <h3 className="text-sm font-semibold text-white truncate text-left">
          {item.name}
        </h3>
        <p className="text-xs text-gray-400 truncate text-left">
          {item.creator}
        </p>
      </div>
      <div className="flex-shrink-0 ml-2">
        {Icon === Heart ? (
          <Heart
            className="text-primary-900"
            color={likes ? "#00D897" : "currentColor"}
            fill={likes ? "#00D897" : "none"}
            size={20}
            onClick={handleLike}
          />
        ) : (
          <Clock className="text-primary-900" size={20} />
        )}
      </div>
    </div>
  );
};

export default AICard;
