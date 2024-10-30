import { useState, useEffect, useRef } from "react";
import { SearchIcon } from "lucide-react";

interface SearchProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Search = ({ setSearch }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Debouncing: 500ms 동안 입력이 없으면 검색어 업데이트
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler); // 타이머 초기화
    };
  }, [searchQuery, setSearch]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setSearchQuery(""); // 검색창을 벗어나면 검색어 초기화
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search your best-fit AI"
          className="w-full p-3 pl-10 bg-[#262A35] rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
    </div>
  );
};

export default Search;
