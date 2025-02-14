import { ApiResponse, ProofType, RequestConfig } from "./types";

export class Api {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const hasJson = contentType?.includes("application/json");
    const data = hasJson ? await response.json() : null;

    if (!response.ok) {
      return {
        error: {
          message: data?.message || data?.error || `API error: ${response.status} ${response.statusText}`,
          status: response.status,
        },
      };
    }

    return { data };
  }

  public async request<T>(
    endpoint: string,
    config: RequestConfig & { maxRetries?: number } = {},
    baseUrl?: string
  ): Promise<ApiResponse<T>> {
    const { headers = {}, maxRetries = 1, isFormData = false, ...options } = config;

    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
    };

    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const finalHeaders = {
      ...defaultHeaders,
      ...headers,
    };

    let attempt = 1;
    while (true) {
      const response = await fetch(`${baseUrl || this.baseUrl}${endpoint}`, {
        ...options,
        headers: finalHeaders,
      });

      if (!response.ok && attempt < maxRetries) {
        attempt++;
        continue;
      }

      const result = await this.handleResponse<T>(response);

      return result;
    }
  }

  async getMerkleTreeForCredential(proofType: ProofType) {
    return await this.request<string>(`/v1/anon/merkle_tree`);
  }
}
