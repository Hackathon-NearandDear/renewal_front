import React, { useState } from "react";
import { DialogContent } from "@/components/ui/dialog";
import { CardData } from "@/utils/interface";
import { useRouter } from "next/router";
import { getDate } from "@/utils/lib/date";
import { txScanURL } from "@/utils/lib/txscan";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface AIDetailsPropWithName {
  ai_detail: CardData;
}

const AIDetailsPopup: React.FC<AIDetailsPropWithName> = ({
  ai_detail,
}: AIDetailsPropWithName) => {
  const router = useRouter();
  const [isRagOpen, setIsRagOpen] = useState(false);

  const handleClick = () => {
    router.push(`/ai/${ai_detail.id}/chat`);
  };

  // 텍스트와 색상을 상수로 정의
  const categoryColor = "#00D897";
  const backgroundColor = "#2A2D36";
  const noInfoText = "No information available.";

  // RAG 토글 핸들러 함수
  const toggleRagSection = () => setIsRagOpen((prev) => !prev);

  return (
    <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-visible flex flex-col bg-[#1F222A]">
      <div className="px-6 pt-6 pb-3 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex justify-center pt-5">
            <div
              className={`inline-block px-3 py-1 bg-[${categoryColor}] rounded-full text-sm font-medium`}
            >
              {ai_detail.category}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#00D897] text-center break-words">
            {ai_detail.name}
          </h2>

          <p className="text-gray-400 text-center">
            Created by <span className="font-medium">{ai_detail.creator}</span>
          </p>

          <p className="text-gray-400 text-center">
            Average # of Tokens:
            <span className="text-white font-bold ml-1">
              {Math.round(
                ai_detail.total_token_usage / (ai_detail.chat_count || 1)
              )}
            </span>
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-300 text-sm text-center">
              {ai_detail.introductions || noInfoText}
            </p>
          </div>

          {/* RAG Section */}
          <div
            className={`bg-[${backgroundColor}] rounded-2xl overflow-hidden`}
          >
            <button
              className="w-full p-4 text-left font-semibold text-white flex justify-between items-center"
              onClick={toggleRagSection}
            >
              RAG
              {isRagOpen ? (
                <ChevronUp size={20} color={categoryColor} />
              ) : (
                <ChevronDown size={20} color={categoryColor} />
              )}
            </button>

            {isRagOpen && (
              <div className="p-4 space-y-2">
                {ai_detail.rags.length > 0 ? (
                  ai_detail.rags.map((rag: any, index: number) => (
                    <RagItem key={index} rag={rag} />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">{noInfoText}</p>
                )}
              </div>
            )}
          </div>

          {/* Examples Section */}
          <div className={`bg-[${backgroundColor}] rounded-2xl p-4`}>
            <h3 className="font-semibold text-white mb-2">Examples</h3>
            {ai_detail.examples ? (
              <p className="text-gray-300 text-sm">{ai_detail.examples}</p>
            ) : (
              <p className="text-gray-400 text-sm italic">{noInfoText}</p>
            )}
          </div>
        </div>
      </div>

      {/* Start Chat Button */}
      <div className="p-4 mt-auto">
        <button
          className="w-full py-2 bg-[#00D897] font-bold text-lg hover:bg-[#00C087] rounded-full flex items-center justify-center focus:outline-none transition duration-300 ease-in-out"
          onClick={handleClick}
        >
          Start a Chat <ArrowRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </DialogContent>
  );
};

// RAG 정보를 표시하는 컴포넌트를 별도로 추출
const RagItem: React.FC<{ rag: any }> = ({ rag }) => {
  console.log(rag);
  return (
    <div className="bg-[#1F222A] p-3 rounded-lg">
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-300">{rag.comments}</p>
        <p className="bg-[#00D897] text-[#1F222A] font-medium text-xs px-2 py-1 rounded-full">
          {getDate(rag.created_at)}
        </p>
      </div>
      <a
        className="text-[#00D897] text-xs break-all hover:underline mt-1 block"
        href={txScanURL(rag.tx_hash)}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Transaction
      </a>
    </div>
  );
};

export default AIDetailsPopup;
