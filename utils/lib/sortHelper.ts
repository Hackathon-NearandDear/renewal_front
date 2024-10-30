import { CardData } from "@/utils/interface";

export const sortCards = (
  cards: CardData[] | null,
  sortBy: "latest" | "popular"
): CardData[] => {
  if (!cards) return [];

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
