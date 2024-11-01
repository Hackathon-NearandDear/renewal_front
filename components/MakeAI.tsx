import { useState, useEffect, useContext } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import AIFormField from "@/components/AIFormField";
import { useAIModel } from "@/utils/hooks/useAIModel";
import { useUserStore } from "@/store/userStore";
import { sanitizeAIName, limitContentLength } from "@/utils/lib/makeai";
import { NearContext, CONTRACT_ADDRESS } from "./wallet/Near";

type CategoryKey =
  | "education"
  | "health & fitness"
  | "entertainment"
  | "social networking"
  | "business"
  | "developer tools"
  | "graphics & design"
  | "others";

interface CreateCustomAISheetProps {
  onAICreated: () => void;
}

const CreateCustomAISheet: React.FC<CreateCustomAISheetProps> = ({
  onAICreated,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [nameTooLong, setNameTooLong] = useState(false);
  const { aiData, setAIData, handleCreate } = useAIModel();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const { signedAccountId, wallet } = useContext(NearContext);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setAIData((prevData) => ({
      ...prevData,
      [name]:
        name === "name"
          ? sanitizeAIName(value)
          : name === "rag_contents"
          ? limitContentLength(value)
          : value,
    }));
  };

  const handleCategoryChange = (category: CategoryKey) => {
    setSelectedCategory(category);
    setAIData((prev) => ({ ...prev, category }));
  };

  const categories: string[] = [
    "Education",
    "Health & Fitness",
    "Entertainment",
    "Social networking",
    "Business",
    "Developer tools",
    "Graphics & Design",
    "Others",
  ];

  const isFormValid =
    aiData.name !== "" &&
    selectedCategory !== "" &&
    aiData.introductions !== "" &&
    aiData.rag_contents !== "";

  const handleCreateAI = async () => {
    if (isFormValid) {
      setLoading(true);
      const ai_id = user?.user_address + "_" + aiData.name;

      const isAIAlreadyRegisterInBlockchain = await wallet?.viewMethod({
        contractId: CONTRACT_ADDRESS,
        method: "get_ai",
        args: { ai_id: ai_id },
      });

      const res: any = (async () => {
        if (isAIAlreadyRegisterInBlockchain) {
          const res: any = await wallet?.callMethod({
            contractId: CONTRACT_ADDRESS,
            method: "update_ai",
            args: { aiId: ai_id, ragPrompt: aiData.rag_contents },
          });
          console.log("res1", res);
          return res;
        } else {
          const res: any = await wallet?.callMethod({
            contractId: CONTRACT_ADDRESS,
            method: "register_ai",
            args: { aiId: ai_id, ragPrompt: aiData.rag_contents },
          });
          console.log("res1", res);
          return res;
        }
      })();

      const result = await res;
      if (result[0]) {
        const createData = {
          ...aiData,
          rag_comments: "Create AI",
          tx_hash: result[1].transaction.hash,
        };
        await handleCreate(createData);
        setLoading(false);
        onAICreated(); // AI 생성 후 부모 컴포넌트 콜백 호출
        setOpen(false); // 시트 닫기
      } else {
        window.alert("Fail to Create AI");
        setLoading(false);
        onAICreated(); // 실패해도 부모 콜백 호출
        setOpen(false); // 시트 닫기
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="w-full py-4 bg-primary-900 text-white hover:bg-primary-700 rounded-full flex items-center justify-center">
          <Plus className="mr-4" size={24} />
          Create Custom AI
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-w-[600px] mx-auto h-[calc(100vh-4rem)] p-0 border-t-0"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold flex-grow text-center">
              Create Custom AI
            </h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <div>
              <AIFormField
                label="AI Name"
                value={aiData.name}
                onChange={handleInputChange}
                placeholder="Name your AI (max 20 characters)"
                name="name"
              />
              {nameTooLong && (
                <p className="text-red-500 text-sm mt-2">
                  AI Name cannot exceed 20 characters.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const categoryKey = category
                    .toLowerCase()
                    .replace(/ & /g, " ")
                    .replace(/ /g, "-") as CategoryKey;
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(categoryKey)}
                      className={`px-4 text-primary-900 bg-primary-900 border-primary-900 border bg-opacity-10 rounded-full flex-shrink-0 transition-colors duration-200 ease-in-out ${
                        selectedCategory === categoryKey
                          ? "border border-primary-900"
                          : "border-opacity-10"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
            <AIFormField
              label="Describe your AI"
              value={aiData.introductions}
              onChange={handleInputChange}
              placeholder="Describe your AI in a first person pronoun (e.g. I am an expert on global travel)"
              name="introductions"
              type="textarea"
              rows={3}
            />
            <AIFormField
              label="Data"
              value={aiData.rag_contents}
              onChange={handleInputChange}
              placeholder="Provide things to learn (max 400 characters)"
              name="rag_contents"
              type="textarea"
              rows={3}
            />
            <AIFormField
              label="Examples"
              value={aiData.examples}
              onChange={handleInputChange}
              placeholder="Provide an example to initiate the conversation"
              name="examples"
            />
          </div>
          <div className="p-4">
            <button
              className={`w-full py-4 rounded-full flex items-center justify-center transition-colors duration-200 disabled:bg-gray-600 ${
                isFormValid
                  ? "bg-primary-900 text-white hover:bg-primary-700"
                  : "bg-primary-900 bg-opacity-20 text-primary-900 cursor-not-allowed"
              }`}
              onClick={handleCreateAI}
              disabled={!isFormValid || loading}
            >
              {loading ? "Creating AI..." : "Create"}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCustomAISheet;
