export type ApiResponse<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: {
        message: string;
        status: number;
      };
    };

export type RequestConfig = {
  authenticated?: boolean;
  headers?: Record<string, string>;
  isFormData?: boolean;
} & Omit<RequestInit, "headers">;

export type CreatePostProofInput = {
  text?: string;
  quote?: string;
  parent?: string;
  community?: string;
};

export type CastData = {
  text: string;
  assetUrls: string[];
  topic?: string;
  communityId?: string;
  quoteId?: string;
  quoteFid?: number;
  replyId?: string;
  replyFid?: number;
  mentions?: number[];
  mentionsPositions?: number[];
};

export enum ProofType {
  CREATE_POST = "create_post",
}

export type Credential<T = CreatePostProofInput> = {
  proof: number[];
  publicInputs: string[];
  proofType: ProofType;
  input: T;
  reveal?: string;
  revealHash?: string;
};
