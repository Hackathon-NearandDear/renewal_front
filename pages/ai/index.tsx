import React, { useState, useEffect, useRef, useCallback } from "react";

import { AIModel } from "@/utils/interface";
import Search from "@/components/search/Search";
const ITEMS_PER_LOAD = 3;

const ListPage = () => {
  const [displayedCards, setDisplayedCards] = useState<AIModel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [aiList, setAiList] = useState<AIModel[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCardElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreCards();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreCards = () => {
    setLoading(true);
    setTimeout(() => {
      setDisplayedCards((prevCards) => {
        const newCards = aiList.slice(
          prevCards.length,
          prevCards.length + ITEMS_PER_LOAD
        );
        if (prevCards.length + newCards.length >= aiList.length) {
          setHasMore(false);
        }
        return [...prevCards, ...newCards];
      });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadMoreCards();
  }, []);

  return <div className="flex-grow overflow-y-auto"></div>;
};

export default ListPage;

export async function getStaticProps() {
  return {
    props: {
      title: "AI Models",
    },
  };
}
