// pages/my-balance.tsx
import { useContext, useEffect, useState } from "react";

import { useUserStore } from "@/store/userStore";
import AIBalanceCard from "@/components/mybalance/AIBalanceCard";
import BalanceOverview from "@/components/mybalance/BalanceOverview";
import { useLoadAIModels } from "@/utils/hooks/useLoadAIModels";
import { CardData } from "@/utils/interface";
import { NearContext } from "@/components/wallet/Near";
import { CONTRACT_ADDRESS } from "@/components/wallet/Near";
const MyBalancePage = () => {
  const { user } = useUserStore();
  // 'myAI' 모드로 useLoadAIModels 사용
  const {
    cards: myAIs,
    isLoading,
    loadAIModels,
  } = useLoadAIModels(
    "myAI",
    user?.user_address // user_address를 전달
  );
  const [trial, setTrial] = useState(0);
  const [balance, setBalance] = useState(0);
  const [aiWithEarnings, setAiWithEarnings] = useState<CardData[]>([]);
  const { signedAccountId, wallet } = useContext(NearContext);

  const getView = async () => {
    const trial = await wallet?.viewMethod({
      contractId: CONTRACT_ADDRESS,
      method: "get_free_trial_count",
      args: { userAccountId: signedAccountId },
    });
    setTrial(Number(trial));

    const bal = await wallet?.viewMethod({
      contractId: CONTRACT_ADDRESS,
      method: "get_consumer_balance",
      args: { userAccountId: signedAccountId },
    });
    setBalance(Number(bal));
  };

  // 페이지가 로드될 때 AI 모델들을 불러오는 함수 호출
  useEffect(() => {
    if (user?.user_address) {
      loadAIModels();
    }
    getView();
  }, [user?.user_address, loadAIModels]);

  useEffect(() => {
    if (myAIs?.length) {
      fetchAIsWithEarnings();
    }
  }, [myAIs]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!user?.user_address) {
    return (
      <div className="text-white">
        Please connect your wallet to view your balance.
      </div>
    );
  }

  const fetchAIsWithEarnings = async () => {
    if (!myAIs) return;

    const updatedAIs = await Promise.all(
      myAIs.map(async (ai) => {
        const res = await wallet?.viewMethod({
          contractId: CONTRACT_ADDRESS,
          method: "get_ai_collecting_rewards",
          args: { userAccountId: user?.user_address, ai_id: ai.id },
        });

        const earnings = typeof res === "string" ? Number(res) : 0;

        return {
          ...ai,
          earnings,
        };
      })
    );

    setAiWithEarnings(updatedAIs); // AI 데이터를 earnings와 함께 업데이트
  };

  const totalEarnings =
    aiWithEarnings?.reduce((sum, ai) => sum + ai.earnings, 0) || 0;

  return (
    <div className="pb-16">
      <BalanceOverview
        totalBalance={balance}
        totalEarnings={totalEarnings}
        trial={trial}
        getView={getView}
      />
      <h2 className="text-white text-xl font-semibold mb-4">
        Overview of My Creations
      </h2>
      {aiWithEarnings?.map((ai) => (
        <AIBalanceCard
          key={ai.id}
          id={ai.id}
          name={ai.name}
          category={ai.category}
          imageSrc={ai.profile_image_url}
          usage={ai.total_token_usage}
          earnings={ai.earnings}
        />
      ))}
    </div>
  );
};

export default MyBalancePage;

export async function getStaticProps() {
  return {
    props: {
      title: "My Balance",
    },
  };
}
