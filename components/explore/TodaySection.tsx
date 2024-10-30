import { CardData } from "@/utils/interface";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "@/utils/lib/sliderSettings";
import { AI_API } from "@/utils/api/ai";
import { useUserStore } from "@/store/userStore";
import useSWR from "swr";
import { fetcher } from "@/utils/api/fetch";
import TodayCard from "./TodayCard";

interface TodaySectionProps {
  toggleLike: (user_address: string, ai_id: string, like: boolean, mutate: any) => {}
}

const TodaySection: React.FC<TodaySectionProps> = ({
  toggleLike
}) => {
  const [showArrows, setShowArrows] = useState(false);
  const { user } = useUserStore();
  const { data : todayData, error, isLoading } = useSWR(`${AI_API.GET_TODAY_AIS(user?.user_address!)}?offset=${0}&limit=${10}`, fetcher);

  useEffect(() => {
    const handleResize = () => {
      setShowArrows(window.innerWidth >= 450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const dynamicSliderSettings = {
    ...sliderSettings, // 기본 설정을 복사
    arrows: showArrows, // showArrows에 따른 arrows 속성 추가
  };

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-4">Today</h2>
        <Slider {...dynamicSliderSettings}>
          {todayData.ais?.map((item: CardData, index: number) => (
            <TodayCard 
            key={item.aiId}
            item={item}
            index={index}
            user_address={user?.user_address!}
            toggleLike={toggleLike}
            />
          ))}
        </Slider>
    </section>
  );
};

export default TodaySection;
