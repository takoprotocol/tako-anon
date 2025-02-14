import { buildHashFunction } from "@takoprotocol/anon-zk";
import { LeanIMT } from "@zk-kit/lean-imt";
import { Address, pad, zeroAddress } from "viem";

const MAX_LEAVES = 2 ** 13;

export const buildMerkleTree = async (addresses?: Address[]) => {
  const owners = addresses;

  if (!owners) {
    console.error("buildMerkleTree: No addresses provided");
    throw new Error("buildMerkleTree: No addresses provided");
  }

  const leaves = owners.map((owner) => pad(owner)).slice(0, MAX_LEAVES);
  while (leaves.length < MAX_LEAVES) {
    leaves.push(pad(zeroAddress));
  }

  const hasher = await buildHashFunction();
  const tree = new LeanIMT(
    hasher,
    leaves.sort((a, b) => a.localeCompare(b))
  );

  return tree;
};
