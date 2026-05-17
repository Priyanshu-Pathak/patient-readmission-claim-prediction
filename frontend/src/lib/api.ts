import {
  ReadmissionRequest,
  ClaimRequest,
  ReadmissionResponse,
  ClaimResponse,
  AnalyticsSummary,
  AnalyticsExploreResponse,
  ApiResponse,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchWithHandling<T>(
  url: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(
        data.detail || data.error || "API Request failed",
        res.status
      );
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Network error or unavailable service", 503);
  }
}

export const api = {
  predictReadmission: (payload: ReadmissionRequest) =>
    fetchWithHandling<ReadmissionResponse>(
      `${API_BASE}/readmission/predict`,
      { method: "POST", body: JSON.stringify(payload) }
    ),

  predictClaim: (payload: ClaimRequest) =>
    fetchWithHandling<ClaimResponse>(
      `${API_BASE}/claim/predict`,
      { method: "POST", body: JSON.stringify(payload) }
    ),

  /** Aggregate HRRP hospital benchmarking — NOT patient-level or ML output */
  getAnalyticsSummary: () =>
    fetchWithHandling<AnalyticsSummary>(
      `${API_BASE}/analytics/summary`,
      { method: "GET" }
    ),

  /** Interactive HRRP hospital benchmarking explore endpoint */
  getAnalyticsExplore: (params?: { state?: string; condition?: string; top_n?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.state) searchParams.append("state", params.state);
    if (params?.condition) searchParams.append("condition", params.condition);
    if (params?.top_n) searchParams.append("top_n", params.top_n.toString());
    
    const queryString = searchParams.toString();
    const url = `${API_BASE}/analytics/explore${queryString ? `?${queryString}` : ""}`;
    
    return fetchWithHandling<AnalyticsExploreResponse>(url, { method: "GET" });
  },
};
