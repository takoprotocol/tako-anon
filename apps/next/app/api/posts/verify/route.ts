import { CastData, CreatePostProofInput, Credential } from "@takoprotocol/anon-sdk/types";
import { merkleMembership } from "@takoprotocol/anon-zk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check input
    const credential = ((await request.json()) as Credential<CreatePostProofInput> & { cast?: CastData }) || null;
    console.log("Verify: generateProof", credential?.input);

    if (!credential || !credential.proofType) {
      console.log("Verify: Invalid Action");
      return NextResponse.json({ error: "Verify: Invalid Action", status: "error" }, { status: 400 });
    }

    // Check proof
    const isValid = await merkleMembership.verify({
      proof: Uint8Array.from(credential.proof),
      publicInputs: credential.publicInputs,
    });

    if (!isValid) {
      console.log("Verify: Invalid Proof");
      return NextResponse.json({ error: "Verify: Invalid Proof", status: "error" }, { status: 401 });
    }

    console.log("Verify: Valid Proof");
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.log("Verify: Error", error);
    return NextResponse.json({ error: (error as Error)?.message ?? "Unknown error", status: "error" }, { status: 500 });
  }
}
