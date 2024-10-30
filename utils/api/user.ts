import { AICardProps } from "../interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 공통 fetch 요청 처리 함수
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Error: ${response.status} ${response.statusText}\n${errorText}`
    );
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return await response.json();
}

// API 경로 상수화
const USER_API = {
  ADD: "/users/",
  EXISTS: (user_address: string) => `/users/exists/${user_address}`,
  FETCH: (user_address: string) => `/users/${user_address}`,
  CHAT_LIST: (user_address: string) => `/chats/${user_address}`,
  MY_AIS: (user_address: string) => `/ais/user/${user_address}`,
  LIKE_LIST: (user_address: string) => `/ais/likes/${user_address}`,
  ADD_LIKE: "/likes/",
  TRIAL: (user_address: string) =>
    `/contracts/free_trial_count/?user_address=${user_address}`,
  REQUEST_FAUCET: (user_address: string) => `/users/faucet/${user_address}`,
  COLLECT: (user_address: string, ai_id: string) =>
    `/contracts/claim_rewards_by_ai/${user_address}/${ai_id}`,
};

// 사용자 추가
export async function registerUser(userData: {
  user_address: string;
  nickname: string;
  profile_image_url?: string;
  gender?: string;
  country?: string;
  interest?: string;
}) {
  return await apiRequest(USER_API.ADD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_address: userData.user_address,
      nickname: userData.nickname,
      profile_image_url: userData.profile_image_url || "",
      gender: userData.gender || "",
      country: userData.country || "",
      interest: userData.interest || "",
      trial: 10,
    }),
  });
}

// 사용자 존재 여부 확인
export async function fetchUserExists(user_address: string) {
  return await apiRequest(USER_API.EXISTS(user_address));
}

// 사용자 정보 가져오기
export async function fetchUser(user_address: string) {
  return await apiRequest(USER_API.FETCH(user_address));
}

// 채팅 리스트 가져오기
export async function fetchChatList(user_address: string) {
  return await apiRequest(USER_API.CHAT_LIST(user_address));
}

// 사용자가 만든 AI 리스트 가져오기
export async function fetchMyAIs(user_address: string) {
  return await apiRequest(USER_API.MY_AIS(user_address));
}

// 사용자 업데이트
export async function updateUser(userData: {
  user_address: string;
  profile_image_url?: string;
  gender?: string;
  country?: string;
  interest?: string;
  // trial?: number;
}) {
  return await apiRequest(USER_API.ADD, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_address: userData.user_address,
      profile_image_url: userData.profile_image_url || "",
      gender: userData.gender || "",
      country: userData.country || "",
      interest: userData.interest || "",
      // trial: userData.trial || 0,
    }),
  });
}

// 좋아요 리스트 가져오기
export async function fetchLikeList(user_address: string) {
  return await apiRequest(USER_API.LIKE_LIST(user_address));
}

// 좋아요 추가
export async function addLike(userData: {
  user_address: string;
  ai_id: string;
}) {
  return await apiRequest(USER_API.ADD_LIKE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_address: userData.user_address,
      ai_id: userData.ai_id,
    }),
  });
}

// 좋아요 제거
export async function delLike(userData: {
  user_address: string;
  ai_id: string;
}) {
  return await apiRequest(USER_API.ADD_LIKE, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_address: userData.user_address,
      ai_id: userData.ai_id,
    }),
  });
}

// 트라이얼 정보 가져오기
export async function fetchTrial(user_address: string) {
  return await apiRequest(USER_API.TRIAL(user_address));
}

// 유저 충전
export async function requsetFaucet(user_address: string) {
  return await apiRequest(USER_API.REQUEST_FAUCET(user_address), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}
export async function collect(userData: {
  user_address: string;
  ai_id: string;
}) {
  return await apiRequest(
    USER_API.COLLECT(userData.user_address, userData.ai_id),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
}
