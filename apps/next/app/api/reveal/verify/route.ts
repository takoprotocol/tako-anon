import { CreatePostProofInput } from "@takoprotocol/anon-sdk/types";
import { NextResponse } from "next/server";
import { hashMessage } from "viem";

export async function POST(request: Request) {
  try {
    // Check input
    const { reveal, revealHash, input } =
      ((await request.json()) as { reveal: string; revealHash: string; input: CreatePostProofInput }) || null;
    if (!reveal || !revealHash || !input) {
      return NextResponse.json({ error: "Verify: Invalid input", status: "error" }, { status: 400 });
    }

    const hash = hashMessage(JSON.stringify(input) + reveal);
    if (hash !== revealHash) {
      return NextResponse.json({ error: "Verify: Invalid reveal", status: "error" }, { status: 400 });
    }

    console.log("Verify: Valid reveal");
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.log("Verify: Error", error);
    return NextResponse.json({ error: (error as Error)?.message ?? "Unknown error", status: "error" }, { status: 500 });
  }
}
