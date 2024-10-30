import React, { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, Heart, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchLikeList } from "@/utils/api/user";
import { fetchUserChats } from "@/utils/api/chat";
import { useUserStore } from "@/store/userStore";
import logoImg from "@/assets/taillogo.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIItem {
  id: string;
  name: string;
  imageUrl: string;
  creator: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreSaved, setShowMoreSaved] = useState(false);
  const [showMoreHistory, setShowMoreHistory] = useState(false);
  const [savedAIs, setSavedAIs] = useState<AIItem[]>([]);
  const [aiHistory, setAiHistory] = useState<AIItem[]>([]);
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const loadAIData = async () => {
      if (user && user.user_address) {
        try {
          const likeData = await fetchLikeList(user.user_address);
          const formattedLikes = likeData?.ais?.map((like: any) => ({
            id: like.id,
            name: like.name,
            imageUrl: like.profile_img_url || { logoImg },
            creator: like.creator,
          }));
          setSavedAIs(formattedLikes || []);

          const chatData = await fetchUserChats(user.user_address);
          const formattedChats = chatData?.chats?.map((chat: any) => ({
            id: chat.ai.id,
            name: chat.ai.name,
            imageUrl: chat.ai.profile_img_url || { logoImg },
            creator: chat.creator,
          }));
          setAiHistory(formattedChats || []);
        } catch (error) {
          console.error("Error loading AI data:", error);
        }
      }
    };

    loadAIData();
  }, [user?.user_address]);

  const renderAIList = (
    items: AIItem[],
    showMore: boolean,
  ) => {
    const displayItems = showMore ? items : items.slice(0, 3);
    return displayItems.map((item) => (
      <div
        key={item.id}
        className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-[#2A2D36] rounded-lg px-2 transition-colors duration-200"
        onClick={() => router.push(`/ai/${item.id}/chat`)}
      >
        <div className="size-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={logoImg}
            alt={item.name}
            className="object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <span className="font-semibold text-white truncate block">
            {item.name}
          </span>
          <p className="text-xs text-gray-400 truncate">{item.creator}</p>
        </div>
      </div>
    ));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] p-0 flex flex-col pt-10 bg-[#1F222A] border-r border-[#2A2D36]"
      >
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your best-fit AI"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-[#262A35] text-white border-[#2A2D36] focus:border-primary-900"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-white">Saved AI</h3>
              {renderAIList(savedAIs, showMoreSaved)}
              {savedAIs.length > 3 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowMoreSaved(!showMoreSaved)}
                  className="w-full mt-2 justify-start px-2 text-primary-900 hover:bg-[#2A2D36] hover:text-primary-900"
                >
                  {showMoreSaved ? (
                    <ChevronUp className="size-6" />
                  ) : (
                    <>
                      <ChevronDown className="mr-2 size-6" />
                      More
                    </>
                  )}
                </Button>
              )}
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-white">AI History</h3>
              {renderAIList(aiHistory, showMoreHistory)}
              {aiHistory.length > 3 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowMoreHistory(!showMoreHistory)}
                  className="w-full mt-2 justify-start px-2 text-primary-900 hover:bg-[#2A2D36] hover:text-primary-900"
                >
                  {showMoreHistory ? (
                    <ChevronUp className="size-6" />
                  ) : (
                    <>
                      <ChevronDown className="mr-2 size-6" />
                      More
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
