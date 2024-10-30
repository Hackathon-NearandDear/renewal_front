import { useState } from "react";
import CategorySelector, {
  CategoryKey,
  categories,
} from "@/components/explore/CategorySelector";
import TodaySection from "@/components/explore/TodaySection";
import TrendSection from "@/components/explore/TrendSection";
import { addLike, delLike } from "@/utils/api/user";
import { fetcher } from "@/utils/api/fetch";
import { LIKE_API } from "@/utils/api/like";

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");

  const toggleLike = async (user_address: string, ai_id: string, like: boolean, mutate: any) => {
    const newLike = !like;

    // Optimistically update the like state using SWR's mutate
    mutate(newLike, false);
    const userData = {user_address : user_address, ai_id : ai_id}

    try {
      if (like) {
        await delLike(userData)
      } else {
        await addLike(userData)
      }

      // 성공적으로 서버에 반영되면 SWR 데이터 갱신
      mutate(newLike, false);
    } catch (error) {
      console.error('Failed to update like status', error);
      // 실패하면 서버에서 다시 받아 옴
      const likeFromServer = await fetcher(LIKE_API.AI_LIKE(user_address, ai_id))
      mutate(likeFromServer, false);
    }
  };

  return (
    <div className="p-4 pb-16">
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {selectedCategory === "all" && 
      <TodaySection 
      toggleLike={toggleLike}
      />}

      <TrendSection
        title={selectedCategory === "all" ? "Weekly Trends" : selectedCategory}
        selectedCategory={selectedCategory}
        toggleLike={toggleLike}
      />
    </div>
  );
}
