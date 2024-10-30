// components/DropdownMenu.tsx
import { ChevronDown, ChevronUp } from "lucide-react";
import AICard from "./AICard";
import { LucideIcon } from "lucide-react";
import { CardData } from "@/utils/interface";

interface DropdownMenuProps {
  title: string;
  icon: LucideIcon;
  items: CardData[];
  isOpen: boolean;
  setOpenDropdown: (title: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title,
  icon: Icon,
  items,
  isOpen,
  setOpenDropdown,
}) => (
  <div className="relative mb-4">
    <button
      className={`w-full flex items-center justify-between p-4 bg-primary-900 bg-opacity-20 text-primary-900 rounded-xl ${
        isOpen ? "border-2 border-primary-900" : ""
      }`}
      onClick={() => setOpenDropdown(isOpen ? "" : title)}
    >
      <div className="flex-1 text-center">
        <span className="text-lg">{title}</span>
      </div>
      {isOpen ? (
        <ChevronUp className="ml-4 text-primary-900" size={20} />
      ) : (
        <ChevronDown className="ml-4 text-primary-900" size={20} />
      )}
    </button>
    {isOpen && (
      <div className="absolute left-0 right-0 mt-2 bg-[#1F222A] border border-[#2A2D36] shadow-lg rounded-lg z-10 max-h-[252px] overflow-y-auto">
        {items.map((item, index) => (
          <AICard item={item} icon={Icon} key={index} />
        ))}
      </div>
    )}
  </div>
);

export default DropdownMenu;
