import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useRouter } from "next/router";
import { Message, ChatResponse } from "@/utils/interface";
import { createChat, fetchChatHistory, sendMessage } from "@/utils/api/chat";
import { Send } from "lucide-react";
import Logo from "@/assets/logo_apptos.svg";
import { useUserStore } from "@/store/userStore";
import { fetchAIDetails } from "@/utils/api/ai";
import Modal from "@/components/chat/AlertModal";
import { CONTRACT_ADDRESS, NearContext } from "@/components/wallet/Near";
const AIChat = () => {
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const [trial, setTrial] = useState(10);
  const [balance, setBalance] = useState(1000000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
  });
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

  useEffect(() => {
    getView();
    console.log("trial", trial);
    console.log("balance", balance);
  }, [messages]);

  const chatId = useMemo(() => {
    if (user && user.user_address && id) {
      return `${user.user_address}_${id}`;
    }
    return null;
  }, [id, user?.user_address]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId && user && user.user_address) {
      initializeChat();
    }
  }, [chatId, user?.user_address]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    if (!chatId || !user?.user_address) return;

    try {
      const chatHistory = await fetchChatHistory(chatId);
      console.log(chatHistory);
      if (chatHistory.length === 0) {
        await createChat({
          ai_id: id as string,
          user_address: user?.user_address,
        });
        // Add initial AI message
        const initialMessage: Message = {
          role: "ai",
          content: "Hello! How can I assist you?",
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMessage]);
      } else {
        setMessages(chatHistory);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user?.user_address || !chatId) return;
    if (trial === 0 && balance <= 10000) {
      setModalContent({
        title: "Your balance is insufficient",
        message:
          "You don't have enough Balance. \nPlease Charge or Request Faucet.",
      });
      setIsModalOpen(true);
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(chatId, input, user?.user_address);
      const aiMessage: Message = {
        role: "ai",
        content: response.message,
        timestamp: response.created_at,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full text-white ">
      <div className="flex-grow overflow-y-auto space-y-4 pb-36 scrollbar-hide">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "ai" && (
              <div className="mr-2 mb-2 flex-shrink-0">
                <div className="size-10 rounded-full overflow-hidden flex items-center justify-center">
                  <Logo className="" viewBox="0 0 212 181" />
                </div>
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 ${
                message.role === "user"
                  ? "bg-[#00D897] text-[#1F222A]"
                  : "bg-[#373A43] text-white"
              }`}
              style={{
                borderTopLeftRadius: message.role === "user" ? "20px" : "8px",
                borderTopRightRadius: "20px",
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius:
                  message.role === "user" ? "8px" : "20px",
                wordBreak: "break-word",
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#373A43] p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#00D897] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#00D897] rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-[#00D897] rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-16 left-0 right-0 bg-[#1F222A] max-w-[600px] mx-auto">
        <div className=" mx-auto px-3 py-3">
          <div className="flex items-center space-x-2">
            <div className="flex-grow bg-[#373A43] rounded-lg px-5 py-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full bg-transparent outline-none text-white"
              />
            </div>
            <button
              onClick={handleSendMessage}
              className="bg-[#00D897] bg-opacity-80 text-[#1F222A] rounded-full p-4"
              disabled={isLoading}
            >
              <Send color="white" size={20} />
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={() => router.push("/mybalance")}
      />
    </div>
  );
};

export default AIChat;

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  try {
    const aiDetails = await fetchAIDetails(id as string);
    return {
      props: {
        title: aiDetails.name,
        aiName: aiDetails.name,
      },
    };
  } catch (error) {
    console.error("Error fetching AI details:", error);
    return {
      props: {
        title: "AI Chat",
        aiName: "AI Assistant",
      },
    };
  }
}
