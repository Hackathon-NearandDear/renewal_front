// hooks/useAIModel.ts
import { useState, useEffect, useCallback } from "react";
import { fetchAIDetails, createAI, updateAI } from "@/utils/api/ai";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/router";

export const useAIModel = (aiId?: string) => {
  const [aiData, setAIData] = useState({
    name: "",
    category: "others",
    introductions: "",
    rag_contents: "",
    rag_comments: "",
    profile_image_url: "",
    examples: "",
    created_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();
  const router = useRouter();

  const loadAIData = useCallback(async () => {
    if (aiId && typeof aiId === "string") {
      try {
        setLoading(true);
        const fetchedAIData = await fetchAIDetails(aiId);
        setAIData({
          name: fetchedAIData.name,
          category: fetchedAIData.category,
          introductions: fetchedAIData.introductions,
          rag_contents: fetchedAIData.rag_contents,
          rag_comments: fetchedAIData.rag_comments,
          profile_image_url: fetchedAIData.profile_image_url,
          examples: fetchedAIData.examples,
          created_at: fetchedAIData.created_at,
        });
      } catch (err) {
        setError("Failed to load AI data.");
        console.error("Error loading AI data:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [aiId]);

  const handleCreate = async (formData: any) => {
    if (!user?.user_address) {
      setError("User address is required.");
      return;
    }

    const newAI = {
      ...formData,
      creator_address: user.user_address,
      created_at: new Date().toISOString(),
    };

    try {
      await createAI(newAI);
      router.push("/mypage");
    } catch (error) {
      setError("Failed to create AI.");
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!aiId || !user?.user_address) {
      setError("User address or AI ID is missing.");
      return;
    }

    try {
      const updatedAI = {
        ...formData,
        id: aiId,
        creator_address: user.user_address,
      };
      await updateAI(updatedAI);
      router.push("/mypage");
    } catch (error) {
      setError("Failed to update AI.");
    }
  };

  return {
    aiData,
    setAIData,
    loading,
    error,
    loadAIData,
    handleCreate,
    handleUpdate,
  };
};
