import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import { useAIModel } from "@/utils/hooks/useAIModel";
import AIFormField from "@/components/AIFormField";
import { useUserStore } from "@/store/userStore";
import { useAptosCall } from "@/utils/hooks/useAptos";
import { sanitizeAIName, limitContentLength } from "@/utils/lib/makeai";

type CategoryKey =
  | "education"
  | "health & fitness"
  | "entertainment"
  | "social networking"
  | "business"
  | "developer tools"
  | "graphics & design"
  | "others";

const EditAIPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUserStore();
  const { executeTransaction } = useAptosCall();

  const { aiData, setAIData, loadAIData, handleUpdate, error } = useAIModel(
    id as string
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadAIData(); // Load the AI details when the page loads
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setAIData((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? sanitizeAIName(value)
          : name === "rag_contents"
          ? limitContentLength(value)
          : value,
    }));
  };

  const handleCategoryChange = (category: CategoryKey) => {
    setAIData((prevData) => ({ ...prevData, category }));
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

  const handleUpdateAI = async () => {
    setLoading(true);
    const res: any = await executeTransaction("store_rag_data", [
      user?.user_address + "_" + aiData.name,
      aiData.rag_contents,
    ]);

    if (res) {
      const createData = {
        ...aiData,
        rag_comments: "Update AI",
        tx_hash: res.hash,
      };
      await handleUpdate(createData);
    } else {
      window.alert("Fail to Update AI");
    }
    setLoading(false);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="flex-grow overflow-y-auto px-4 pb-32 scrollbar-hide">
        <div className="space-y-6 pb-20">
          {/* Image Upload Section */}
          <div className="flex justify-center">
            <div className="relative size-20 bg-primary-900 rounded-full overflow-hidden">
              {aiData.profile_image_url ? (
                <img
                  src={aiData.profile_image_url}
                  alt="AI"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <input
                    type="file"
                    id="ai-image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      // Handle image upload
                    }}
                  />
                  <label
                    htmlFor="ai-image"
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  >
                    <Plus size={32} className="text-white" />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* AI Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              AI Name
            </label>
            <p className="font-bold">{aiData.name}</p>
          </div>

          {/* Category Selection */}
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
                      aiData.category === categoryKey
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

          {/* Description, Data, and Examples Fields */}
          <AIFormField
            label="Describe your AI"
            value={aiData.introductions}
            onChange={handleInputChange}
            placeholder="Add a short description"
            name="introductions"
            type="textarea"
            rows={2}
          />

          <AIFormField
            label="Data"
            value={aiData.rag_contents}
            onChange={handleInputChange}
            placeholder="Provide things to learn"
            name="rag_contents"
            type="textarea"
            rows={3}
          />

          <AIFormField
            label="Examples"
            value={aiData.examples}
            onChange={handleInputChange}
            placeholder="Provide a short example of this AI."
            name="examples"
            type="textarea"
            rows={1}
          />
        </div>
      </div>

      {/* Update Button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-[#181A20] max-w-[600px] mx-auto">
        <button
          className="w-full py-4 rounded-full flex items-center justify-center bg-primary-900 text-white hover:bg-primary-700 disabled:bg-gray-600"
          onClick={handleUpdateAI}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update AI"}
        </button>
      </div>
    </>
  );
};

export default EditAIPage;

export async function getServerSideProps() {
  return {
    props: {
      title: "Edit AI",
    },
  };
}
