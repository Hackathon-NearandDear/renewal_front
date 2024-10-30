import { useState, useEffect } from "react";
import Search from "@/components/search/Search";
import { AICard } from "@/components/search/AICard";
import CreateCustomAISheet from "@/components/MakeAI";
import { ArrowDownUp } from "lucide-react";
import { useLoadAIModels } from "@/utils/hooks/useLoadAIModels";
import { CardData } from "@/utils/interface";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [showSortOptions, setShowSortOptions] = useState(false);

  // 'search' 모드로 설정하여 데이터 로드
  const { cards, isLoading, loadAIModels } = useLoadAIModels(
    "search",
    "search", // user_address는 search에서 필요없음
    "", // 카테고리도 필요없음
    searchQuery // 검색어 적용
  );
  useEffect(() => {
    loadAIModels();
  }, [searchQuery]);

  const sortedCards = (cards: CardData[] | null) => {
    if (!cards) return [];
    console.log(cards);
    return [...cards].sort((a, b) => {
      if (sortBy === "latest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return b.chat_count - a.chat_count;
      }
    });
  };

  const handleSort = (option: "latest" | "popular") => {
    console.log(option);
    setSortBy(option);
    setShowSortOptions(false);
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="mt-2 mb-4">
        <Search setSearch={setSearchQuery} />
      </div>
      <div className="flex justify-end px-4 mb-2 relative">
        <button
          className="text-[#00D897] flex items-center"
          onClick={() => setShowSortOptions(!showSortOptions)}
        >
          <ArrowDownUp size={16} className="mr-1" />
          Sort by
        </button>
        {showSortOptions && (
          <div className="absolute top-full right-0 mt-1 bg-[#2A2D36] border border-gray-700 rounded-md shadow-lg z-10">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-[#1F222A] text-white"
              onClick={() => handleSort("latest")}
            >
              Latest
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-[#1F222A] text-white"
              onClick={() => handleSort("popular")}
            >
              Most Popular
            </button>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto mb-16">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          sortedCards(cards).map((item) => <AICard key={item.id} item={item} />)
        )}
      </div>
      <div className="fixed bottom-16 left-0 right-0 px-4 mb-4 max-w-[600px] mx-auto">
        <CreateCustomAISheet onAICreated={loadAIModels} />
      </div>
    </div>
  );
}
