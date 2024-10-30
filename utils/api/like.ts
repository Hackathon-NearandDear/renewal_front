const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const LIKE_API = {
  AI_LIKE: (user_address: string, ai_id: string) => `${API_BASE_URL}/likes/user/${user_address}/ai/${ai_id}`,
};