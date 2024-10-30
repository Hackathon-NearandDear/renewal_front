import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, UserRound } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import AICard from "@/components/mypage/AICard";
import Image from "next/image";
import { useLoadAIModels } from "@/utils/hooks/useLoadAIModels";

const MyPage = () => {
  const { user: storedUser, setUser } = useUserStore();

  // 'myAI' 모드로 useLoadAIModels 사용
  const {
    cards: myAIs,
    isLoading,
    error,
    loadAIModels,
  } = useLoadAIModels(
    "myAI",
    storedUser?.user_address // user_address를 전달
  );

  // 페이지가 로드될 때 AI 모델들을 불러오는 함수 호출
  useEffect(() => {
    if (storedUser?.user_address) {
      loadAIModels();
    }
  }, [storedUser?.user_address, loadAIModels]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!storedUser) {
    return <div>User not found. Please connect your wallet.</div>;
  }

  return (
    <div className="flex flex-col px-2 pb-16">
      <div className="flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center">
          <div className="size-20 bg-gray-500 rounded-full mr-4 mx-auto flex items-center justify-center overflow-hidden">
            {storedUser.profile_image_url ? (
              <Image
                src={storedUser.profile_image_url}
                alt="Selected profile"
                width={80}
                height={80}
                className="object-cover transform scale-150 translate-y-[-10%]"
              />
            ) : (
              <UserRound className="text-gray-400 size-16" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{storedUser.nickname}</h2>
            <p className="text-gray-600">Gender: {storedUser.gender || ""}</p>
            <p className="text-gray-600">Country: {storedUser.country || ""}</p>
          </div>
        </div>
        <Link
          href="/editprofile"
          className="font-medium text-lg text-primary-900"
        >
          Edit <Pencil className="inline-block ml-1" size={18} />
        </Link>
      </div>

      <h3 className="text-xl font-semibold py-2">My AI</h3>
      <div>
        {myAIs && myAIs.length > 0 ? (
          myAIs.map((ai) => <AICard key={ai.id} {...ai} />)
        ) : (
          <p>You haven&apos;t created any AIs yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyPage;

export async function getStaticProps() {
  return {
    props: {
      title: "My Page",
    },
  };
}
