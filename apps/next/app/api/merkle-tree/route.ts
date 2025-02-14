import { buildMerkleTree } from "@takoprotocol/anon-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check input
    const { addresses } = await request.json();

    // Build tree
    const tree = await buildMerkleTree(addresses);

    console.log("buildMerkleTree: ", tree.root);

    return NextResponse.json({
      root: tree.root,
      tree: tree.export(),
    });
  } catch (error) {
    console.error("Generate: Generate Merkle Tree Error", error);
    return NextResponse.json({ error: "Generate: Generate Merkle Tree Error" }, { status: 500 });
  }
}
