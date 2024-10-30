import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { AICardProps } from "@/utils/interface";
import AIDetailsPopup from "../explore/AIDetailsPopup";
import logoImg from "@/assets/taillogo.png";

export const AICard = ({ item }: AICardProps) => {
  const router = useRouter();

  const handleChatClick = () => {
    router.push(`/ai/${item.id}/chat`);
  };

  const handleDialogTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 클릭 이벤트가 상위로 전파되지 않도록 막음
  };

  return (
    <div className="flex items-center justify-between px-2 py-3 border-b border-gray-700 w-full">
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="flex items-center cursor-pointer flex-grow min-w-0 mr-4"
            onClick={handleDialogTriggerClick} // 클릭 이벤트 전파 방지
          >
            <div className="flex-shrink-0 mr-4">
              {item.profile_image_url ? (
                <Image
                  src={item.profile_image_url}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
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
            <div className="min-w-0 flex-grow">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-gray-600 truncate">{item.creator}</p>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent
          onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
          className="sm:max-w-[425px] rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
        >
          <AIDetailsPopup ai_detail={item} />
        </DialogContent>
      </Dialog>

      <button
        className="pl-4 pr-2 py-1 bg-primary-900 bg-opacity-20 text-primary-900 rounded-full hover:bg-primary-700 transition-colors flex items-center flex-shrink-0 whitespace-nowrap"
        onClick={handleChatClick}
      >
        Chat
        <ChevronRight className="ml-1" size={18} />
      </button>
    </div>
  );
};
