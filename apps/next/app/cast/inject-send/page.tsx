"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSDK } from "@takoprotocol/anon-react";
import { Signature } from "@takoprotocol/anon-sdk";
import { CreatePostProofInput, ProofType, Credential } from "@takoprotocol/anon-sdk/types";
import { ProofData } from "@takoprotocol/anon-zk";
import { useEffect, useState } from "react";

function Page() {
  const { sdk } = useSDK();
  const [progress, setProgress] = useState(0);
  const [isError, setIsError] = useState(false);

  const generateProof = async () => {
    try {
      setIsError(false);
      setProgress(0);

      setProgress(10);

      const injectData:
        | string
        | {
            signature: Signature;
            input: CreatePostProofInput;
          }
        | undefined = (
        window as unknown as {
          injectData?: {
            signature: Signature;
            input: CreatePostProofInput;
          };
        }
      )?.injectData;
      if (!injectData) {
        setIsError(true);
        window.dispatchEvent(
          new MessageEvent("message", {
            data: { status: "error", message: "No inject data" },
          })
        );
        return;
      }
      setProgress(20);

      let proof: ProofData | null = null;
      try {
        proof = await sdk.generateProof(ProofType.CREATE_POST, injectData.signature);
        if (!proof) {
          throw new Error("Failed to generate proof");
        }
      } catch (e) {
        setIsError(true);
        window.dispatchEvent(
          new MessageEvent("message", {
            data: { status: "error", message: (e as Error).message },
          })
        );
        return;
      }

      setProgress(90);

      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            status: "success",
            credential: {
              publicInputs: proof.publicInputs,
              proof: Array.from(proof.proof),
              proofType: ProofType.CREATE_POST,
              input: injectData.input,
            } satisfies Credential,
          },
        })
      );

      setProgress(100);
    } catch (e) {
      setIsError(true);
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { status: "error", message: (e as Error).message },
        })
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).injectData) {
        clearInterval(interval);
        generateProof();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        {progress}
        <Progress className={cn("h-1 w-[200px]", isError && "bg-red-500")} value={progress} />
      </div>
    </div>
  );
}

export default Page;
