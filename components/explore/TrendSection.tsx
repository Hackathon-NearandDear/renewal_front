import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Card from "./TrendCard";
import AIDetailsPopup from "./AIDetailsPopup";
import { CardData } from "@/utils/interface";
import { DialogTitle } from "@radix-ui/react-dialog";
import useSWR from "swr";
import { AI_API } from "@/utils/api/ai";
import { fetcher } from "@/utils/api/fetch";
import { useUserStore } from "@/store/userStore";

interface TrendSectionProps {
  title: string;
  selectedCategory: string;
  toggleLike: (
    user_address: string,
    ai_id: string,
    like: boolean,
    mutate: any
  ) => {};
}

const TrendSection: React.FC<TrendSectionProps> = ({
  title,
  selectedCategory,
  toggleLike,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserStore();
  console.log(user);
  const {
    data: trendData,
    error,
    isLoading,
  } = useSWR(
    `${AI_API.GET_TREND_AIS(
      user?.user_address!,
      selectedCategory
    )}?offset=${0}&limit=${10}`,
    fetcher
  );

  useEffect(() => {
    console.log("trendData", trendData);
  }, [trendData]);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {trendData &&
          trendData?.ais.map((item: CardData) => (
            <div key={item.id}>
              <Dialog
                onOpenChange={(open) => {
                  setIsOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
                    <Card
                      user_address={user?.user_address!}
                      ai_id={item.id}
                      name={item.name}
                      category={item.category}
                      toggleLike={toggleLike}
                      // like={item.like}
                    />
                  </div>
                </DialogTrigger>

                {isOpen && (
                  <DialogContent>
                    <DialogTitle />
                    <AIDetailsPopup ai_detail={item} />
                  </DialogContent>
                )}
              </Dialog>
            </div>
          ))}
      </div>
    </section>
  );
};

export default TrendSection;
