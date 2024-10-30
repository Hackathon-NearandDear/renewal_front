import { useRef, useState, useEffect } from "react";

export type CategoryKey =
  | "all"
  | "education"
  | "health & fitness"
  | "entertainment"
  | "social networking"
  | "business"
  | "developer tools"
  | "graphics & design"
  | "others";

export const categories: string[] = [
  "All",
  "Education",
  "Health & Fitness",
  "Entertainment",
  "Social networking",
  "Business",
  "Developer tools",
  "Graphics & Design",
  "Others",
];

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: CategoryKey;
  setSelectedCategory: (category: CategoryKey) => void;
}

const MIN_SCROLLBAR_WIDTH = 10; // 최소 스크롤바 너비 (10%)
const WIDE_SCREEN_BREAKPOINT = 450; // 와이드 스크린 기준 너비

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(MIN_SCROLLBAR_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  // 화면 너비 체크 후 상태 업데이트
  const updateIsWideScreen = () => {
    setIsWideScreen(window.innerWidth > WIDE_SCREEN_BREAKPOINT);
  };

  // 스크롤 가능한지 체크
  const checkOverflow = (container: HTMLDivElement) => {
    return container.scrollWidth > container.clientWidth;
  };

  // 스크롤바 너비 업데이트
  const updateScrollbarWidth = (container: HTMLDivElement) => {
    const newScrollbarWidth =
      (container.clientWidth / container.scrollWidth) * 100;
    setScrollbarWidth(Math.max(newScrollbarWidth, MIN_SCROLLBAR_WIDTH)); // 최소 10% 너비
  };

  useEffect(() => {
    updateIsWideScreen();
    window.addEventListener("resize", updateIsWideScreen);

    return () => {
      window.removeEventListener("resize", updateIsWideScreen);
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const hasOverflow = checkOverflow(container);
      setShowScrollbar(hasOverflow && isWideScreen);
      if (hasOverflow) {
        updateScrollbarWidth(container);
      }
    }
  }, [categories, isWideScreen]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition =
        (container.scrollLeft / maxScroll) * (100 - scrollbarWidth);
      setScrollPosition(newPosition);
    }
  };

  const handleScrollbarInteraction = (clientX: number) => {
    const container = scrollContainerRef.current;
    const scrollbar = scrollbarRef.current;
    if (container && scrollbar) {
      const rect = scrollbar.getBoundingClientRect();
      const scrollableWidth = rect.width - (rect.width * scrollbarWidth) / 100;
      const scrollPercentage =
        (clientX - rect.left - (rect.width * scrollbarWidth) / 200) /
        scrollableWidth;
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = Math.max(
        0,
        Math.min(scrollPercentage * maxScroll, maxScroll)
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleScrollbarInteraction(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleScrollbarInteraction(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div className="mb-6">
      <div
        ref={scrollContainerRef}
        className="flex space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
        onScroll={handleScroll}
      >
        {categories.map((category) => {
          const categoryKey = category
            .toLowerCase()
            .replace(/ & /g, " ")
            .replace(/ /g, "-") as CategoryKey;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(categoryKey)}
              className={`px-4 rounded-full flex-shrink-0 border-2 transition-colors duration-200 ease-in-out ${
                selectedCategory === categoryKey
                  ? "bg-primary-900 text-white border-primary-900"
                  : "bg-[#181A20] text-primary-900 border-primary-900 hover:bg-primary-900 hover:bg-opacity-20"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {showScrollbar && (
        <div
          ref={scrollbarRef}
          className="h-2 bg-gray-200 mt-4 rounded-full cursor-pointer relative"
          onMouseDown={handleMouseDown}
        >
          <div
            className="h-full bg-primary-900 rounded-full absolute top-0"
            style={{
              width: `${scrollbarWidth}%`,
              left: `${scrollPosition}%`,
              transition: isDragging ? "none" : "left 0.1s ease-out",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
