import { useUserStore } from "@/store/userStore";
import { addLike, delLike } from "@/utils/api/user";

export const useLikeHandler = (refreshData: () => void) => {
  const { user } = useUserStore();

  const handleLikeClick = async (
    e: React.MouseEvent,
    ai_id: string,
    like: boolean
  ) => {
    e.stopPropagation();
    if (!user || !user.user_address) {
      window.alert("Please log in to like AIs");
      return;
    }

    const userData = {
      user_address: user.user_address,
      ai_id: ai_id,
    };

    try {
      if (like) {
        await delLike(userData);
      } else {
        await addLike(userData);
      }
      refreshData();
    } catch (error) {
      window.alert("Failed to update like status");
    }
  };

  return { handleLikeClick };
};
