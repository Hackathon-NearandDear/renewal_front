import { Message, ChatResponse } from "@/utils/interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 공통 fetch 요청 처리 함수
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.text();
    console.error(
      `Error: ${response.status} ${response.statusText}\n${errorData}`
    );
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return await response.json();
}

// API 경로 상수화
const CHAT_API = {
  USER_CHATS: (user_address: string) => `/chats/user/${user_address}`,
  CREATE_CHAT: "/chats/",
  CHAT_HISTORY: (chatid: string) => `/chats/messages/${chatid}`,
  SEND_MESSAGE: (chat_id: string) => `/chats/message/${chat_id}`,
};

// 사용자 채팅 가져오기
export async function fetchUserChats(user_address: string) {
  return await apiRequest(CHAT_API.USER_CHATS(user_address));
}

// 채팅 생성
export async function createChat(chatData: {
  ai_id: string;
  user_address: string;
}) {
  return await apiRequest(CHAT_API.CREATE_CHAT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chatData),
  });
}

// 채팅 기록 가져오기
export async function fetchChatHistory(chatid: string): Promise<Message[]> {
  try {
    const data = await apiRequest(CHAT_API.CHAT_HISTORY(chatid));

    return data.messages.map((chat: ChatResponse) => {
      const chatContentsId = chat.id || "";
      const isAI = chatContentsId.startsWith("AI_");
      const role = isAI ? "ai" : "user";

      return {
        role: role,
        content: chat.message || "",
        timestamp: chat.created_at || new Date().toISOString(),
      };
    });
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

// 메시지 전송
export async function sendMessage(
  chat_id: string,
  content: string,
  sender: string
): Promise<ChatResponse> {
  return await apiRequest(CHAT_API.SEND_MESSAGE(chat_id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender_id: sender,
      message: content,
    }),
  });
}
