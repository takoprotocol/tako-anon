import type { ProofData, ProofManager } from "@takoprotocol/anon-zk";
import { toArray } from "./utils";
import { Api } from "./api";
import { getPublicKey } from "./utils";
import { LeanIMT } from "@zk-kit/lean-imt";
import { pad } from "viem";
import { ProofType } from "./types";

export type Signature = {
  address: `0x${string}`;
  signature: `0x${string}`;
  messageHash: `0x${string}`;
};

export class TakoAnonSDK extends Api {
  private merkleMembership!: ProofManager;
  private hasher!: (a: string, b: string) => string;

  constructor(apiUrl?: string) {
    super(apiUrl || "http://locahost:3000/api");
  }

  async instantiate() {
    if (this.merkleMembership) return;
    const { buildHashFunction, merkleMembership } = await import("@takoprotocol/anon-zk");
    this.hasher = await buildHashFunction();
    this.merkleMembership = merkleMembership;
  }

  async generateProof(proofType: ProofType, signature: Signature) {
    await this.instantiate();

    const response = await this.getMerkleTreeForCredential(proofType);
    if (response.error) throw new Error(response.error.message);

    const tree = LeanIMT.import(this.hasher, response.data, (value) => value);

    const paddedAddress = pad(signature.address).toLowerCase();
    const leafIndex = tree.leaves.map((leaf) => leaf.toLowerCase()).indexOf(paddedAddress);

    if (leafIndex === -1) throw new Error("Leaf not found");

    const { root, index, siblings } = tree.generateProof(leafIndex);
    const { pubKeyX, pubKeyY } = await getPublicKey(signature.signature, signature.messageHash);

    const input = {
      signature: toArray(signature.signature).slice(0, 64),
      message_hash: toArray(signature.messageHash),
      pub_key_x: pubKeyX,
      pub_key_y: pubKeyY,
      root,
      index,
      path: siblings,
    };

    return await this.merkleMembership.generate(input);
  }

  async verifyProof(proof: ProofData) {
    await this.instantiate();

    return await this.merkleMembership.verify(proof);
  }
}

export { buildMerkleTree } from "./merkle-tree";
