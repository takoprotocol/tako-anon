import { CreatePostProofInput, Credential } from "@takoprotocol/anon-sdk/types";
import { ApiClient } from "./client";

const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "");

export interface PostCastResponse {
  status: "success" | "error";
  error?: string;
  data: {
    hash: string;
    mentioned_communities: string[];
  };
}

export const api = {
  createPost: async (data: Credential<CreatePostProofInput>) => {
    const response = await apiClient.request<PostCastResponse>(`/posts/create`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },
};
