const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 공통 fetch 요청 처리 함수
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  // const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const response = await fetch(`${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.text();
    console.error(
      `Error: ${response.status} ${response.statusText}\n${errorData}`
    );
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  const responseJson = await response.json()
  console.log('response', responseJson)
  return responseJson
  // return await response.json();
}

// API URL 상수화
export const AI_API = {
  GET_AI_LIST: () => `${API_BASE_URL}/ais/`,
  GET_TREND_AIS: (address: string, category: string) => `${API_BASE_URL}/ais/trend/${address}/${category}`,
  GET_TODAY_AIS: (address: string) => `${API_BASE_URL}/ais/today/${address}`,
  GET_SEARCHED_AIS: (name: string, address: string) => `${API_BASE_URL}/ais/search/${name}/${address}`,

  GET_AIS_BY_USER: (userid: string) => `${API_BASE_URL}/ais/user/${userid}`,
  GET_AI_DETAIL_BY_ID: (id: string) => `${API_BASE_URL}/ais/id/${id}`,
  GET_AI_LOGS: (id: string) => `${API_BASE_URL}/ailogs/ai/${id}`,

  DELETE_AI: (id: string) => `${API_BASE_URL}/ai/${id}`,
};

// API 요청 함수들

export async function fetchTrendingAIs(
  category: string,
  address: string,
  query: { offset?: number; limit?: number } = {}
) {
  const { offset = 0, limit = 10 } = query;
  const endpoint = `${AI_API.GET_TREND_AIS(
    address,
    category
  )}?offset=${offset}&limit=${limit}`;
  return await apiRequest(endpoint);
}

export async function fetchAIs(offset: number, limit: number) {
  console.log("error line",`${AI_API.GET_AI_LIST()}?offset=${offset}&limit=${limit}`);
  return await apiRequest(`${AI_API.GET_AI_LIST()}?offset=${offset}&limit=${limit}`);
}

export async function fetchTodayAIs(address: string) {
  return await apiRequest(`${AI_API.GET_TODAY_AIS(address)}`);
}

export async function fetchAIDetails(id: string) {
  return await apiRequest(`${AI_API.GET_AI_DETAIL_BY_ID(id)}`);
}

export async function fetchSearchAIs(name: string, address: string) {
  try {
    return await apiRequest(`${AI_API.GET_SEARCHED_AIS(name, address)}`);
  } catch (error: any) {
    if (error.message.includes("404")) {
      throw new Error("No results found");
    }
    throw error;
  }
}

export async function fetchAILogs(id: string) {
  return await apiRequest(AI_API.GET_AI_LOGS(id));
}

export async function createAI(aiData: {
  name: string;
  creator_address: string;
  category: string;
  introductions: string;
  profile_image_url: string;
  rag_contents: string;
  rag_comments: string;
  created_at: string;
  examples: string;
  tx_hash: string;
}) {
  console.log(aiData.rag_comments);
  return await apiRequest(`${AI_API.GET_AI_LIST()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aiData),
  });
}

export async function fetchMyAIs(userid: string) {
  return await apiRequest(`${AI_API.GET_AIS_BY_USER(userid)}`);
}

export async function deleteAI(id: string) {
  return await apiRequest(`${AI_API.DELETE_AI(id)}`, { method: "DELETE" });
}

export async function updateAI(aiData: {
  id: string;
  creator_address: string;
  profile_image_url: string;
  category: string;
  introductions: string;
  rag_contents: string;
  rag_comments: string;
  examples: string;
  created_at: string;
  tx_hash: string;
}) {
  return await apiRequest(`${AI_API.GET_AI_LIST()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aiData),
  });
}
