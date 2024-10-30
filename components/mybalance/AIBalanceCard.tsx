// components/AIBalanceCard.tsx
import Image from "next/image";
import logoImg from "@/assets/taillogo.png";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { collect } from "@/utils/api/user";
import { decimalconverter } from "@/utils/lib/decimalconverter";

interface AIBalanceCardProps {
  id: string;
  name: string;
  category: string;
  imageSrc?: string;
  usage: number;
  earnings: number;
}

const AIBalanceCard: React.FC<AIBalanceCardProps> = ({
  id,
  name,
  category,
  imageSrc,
  usage,
  earnings,
}) => {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleCollect = async () => {
    if (user?.user_address) {
      setLoading(true);
      const userData = {
        user_address: user?.user_address,
        ai_id: id,
      };
      await collect(userData);
      setLoading(false);
      window.alert("Collect Success!");
    } else {
      window.alert("User Not Found");
    }
  };

  return (
    <div className="bg-[#2A2D36] rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center flex-grow mr-4">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={name}
              width={48}
              height={48}
              className="rounded-full mr-3 flex-shrink-0"
            />
          ) : (
            <div className="w-[50px] h-[50px] flex items-center justify-center mr-3">
              <Image
                src={logoImg}
                alt="Default Logo"
                className="object-contain"
              />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <h3 className="text-lg text-white font-semibold truncate max-w-[150px]">
              {name}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary-900 px-2 py-1 rounded-full border border-primary-900 whitespace-nowrap">
                {category}
              </span>
            </div>
          </div>
        </div>
        <button
          className={`font-medium flex-shrink-0 ${
            loading ? "text-white cursor-not-allowed" : "text-primary-900"
          }`}
          onClick={handleCollect}
        >
          {loading ? "Collecting..." : "Collect"}
        </button>
      </div>
      <div className="flex mt-4 divide-x divide-gray-300">
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Usage</p>
          <p className="text-lg text-white">{usage} tokens</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Earnings</p>
          <p className="text-lg text-white">
            {earnings ? decimalconverter(earnings) : 0} mAPT
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIBalanceCard;
