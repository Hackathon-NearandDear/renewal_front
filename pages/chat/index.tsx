import { useEffect, useState } from "react";
import { Heart, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchUserChats } from "@/utils/api/chat";
import { fetchLikeList } from "@/utils/api/user";
import { useUserStore } from "@/store/userStore";
import DropdownMenu from "@/components/chat/DropdownMenu";
import { CardData } from "@/utils/interface";

const ChatPage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [chats, setChats] = useState<CardData[]>([]);
  const [likes, setLikes] = useState<CardData[]>([]);

  const { user } = useUserStore();

  useEffect(() => {
    const loadAIModels = async () => {
      if (user && user.user_address) {
        try {
          const ChatData = await fetchUserChats(user.user_address);
          const formattedChats = ChatData?.chats?.map((chat: any) => ({
            id: chat.ai.id,
            name: chat.ai.name,
            creator: chat.creator,
            imageSrc: chat.ai.profile_img_url || "",
            icon: Clock,
          }));
          setChats(formattedChats || []);

          const LikeData = await fetchLikeList(user.user_address);
          const formattedLikes = LikeData?.ais?.map((like: any) => ({
            id: like.id,
            name: like.name,
            creator: like.creator,
            imageSrc: like.profile_img_url || "",
            icon: Heart,
          }));
          setLikes(formattedLikes || []);
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadAIModels();
  }, [user?.user_address]);
  console.log(likes);
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#181A20] flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-6 text-center">
        <h2 className="text-xl text-gray-400 mb-6">Select one from below:</h2>
        <DropdownMenu
          title="Choose from Saved AI"
          icon={Heart} // LucideIcon 타입으로 전달
          items={likes || []}
          isOpen={openDropdown === "Choose from Saved AI"}
          setOpenDropdown={setOpenDropdown}
        />
        <DropdownMenu
          title="See AI History"
          icon={Clock} // LucideIcon 타입으로 전달
          items={chats}
          isOpen={openDropdown === "See AI History"}
          setOpenDropdown={setOpenDropdown}
        />
        <Link href="/explore" passHref>
          <div className="w-full flex items-center justify-between p-4 bg-primary-900 bg-opacity-20 text-primary-900 rounded-xl transition-all duration-200 hover:bg-[#2A2D36]">
            <div className="flex-1 text-center">
              <span className="text-lg">Go Explore More</span>
            </div>
            <ArrowRight className="ml-4 text-primary-900" size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ChatPage;
