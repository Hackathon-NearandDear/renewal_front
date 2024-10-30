import { useState, useCallback } from "react";
import {
  fetchAIs,
  fetchTodayAIs,
  fetchTrendingAIs,
  fetchSearchAIs,
} from "@/utils/api/ai";
import { CardData } from "@/utils/interface";
import { fetchMyAIs } from "../api/user";

export const useLoadAIModels = (
  mode: "search" | "explore" | "myAI", // 다양한 모드를 처리할 수 있도록 구성
  user_address: string | undefined,
  selectedCategory: string = "", // 카테고리는 explore에서만 사용
  query: string = "", // 검색어는 search에서만 사용
) => {
  const [cards, setCards] = useState<CardData[] | null>(null);
  const [todayCards, setTodayCards] = useState<CardData[] | null>(null);
  const [trendCards, setTrendCards] = useState<CardData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAIModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      switch (mode) {
        case "explore":
          if (!user_address) return; // explore 모드에서는 user_address 필수
          const todayData = await fetchTodayAIs(user_address);
          setTodayCards(todayData.ais);

          const trendData = await fetchTrendingAIs(
            selectedCategory,
            user_address,
            { offset: 0, limit: 10 },
          );
          setTrendCards(
            trendData.ais.sort(
              (a: CardData, b: CardData) =>
                b.daily_user_access - a.daily_user_access,
            ),
          );
          break;

        case "search":
          if (query) {
            const searchData = await fetchSearchAIs(query, user_address || "");
            setCards(searchData.ais);
          } else {
            const searchData = await fetchAIs(0, 50);
            setCards(searchData.ais);
          }

          break;

        case "myAI":
          if (!user_address) return;
          const myAIs = await fetchMyAIs(user_address);
          setCards(myAIs.ais || []);
          break;
        default:
          throw new Error("Unknown mode");
      }
    } catch (err) {
      setError("Failed to fetch AI models");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [mode, user_address, selectedCategory, query]);

  return { todayCards, trendCards, cards, isLoading, error, loadAIModels };
};
