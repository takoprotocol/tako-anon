import { CastData } from "@takoprotocol/anon-react";

class TakoService {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.dev.tako.so/v1";
  private static instance: TakoService;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static getInstance() {
    if (!TakoService.instance) {
      const apiKey = process.env.TAKO_API_KEY ?? "NO_KEY";
      if (!apiKey) {
        throw new Error("TAKO_API_KEY is not set");
      }
      TakoService.instance = new TakoService(apiKey);
    }
    return TakoService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options?: {
      method?: "GET" | "POST" | "DELETE";
      maxRetries?: number;
      retryDelay?: number;
      body?: string;
    }
  ): Promise<T> {
    const { maxRetries = 1, retryDelay = 10000, method, body } = options ?? {};
    let retries = 0;

    while (retries < maxRetries) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Request-Auth": this.apiKey,
        "X-Lang": "zh-CN",
      };
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
        method,
        body,
      });

      if (response.status === 202 && maxRetries > 1) {
        retries++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      if (!response.ok) {
        console.error(await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    }

    throw new Error("Maximum retries reached while waiting for data");
  }

  async createPost(params: CastData) {
    const response = await this.makeRequest<{
      status: string;
      data: {
        hash: string;
      };
    }>("/fc/casts", {
      method: "POST",
      body: JSON.stringify({
        chain_id: 10,
        ...params,
      }),
    });

    return response;
  }
}

export const tako = TakoService.getInstance();
