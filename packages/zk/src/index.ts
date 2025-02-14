import { InputMap, type Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend, BarretenbergVerifier, ProofData } from "@aztec/bb.js";
import { BarretenbergSync, Fr } from "@aztec/bb.js";
import { CircuitConfig, CircuitType, getCircuitConfig } from "./utils";
export type { ProofData } from "@aztec/bb.js";

type ProverModules = {
  Noir: typeof Noir;
  UltraHonkBackend: typeof UltraHonkBackend;
};

type VerifierModules = {
  BarretenbergVerifier: typeof BarretenbergVerifier;
};

export const buildHashFunction = async () => {
  const bb = await BarretenbergSync.new();
  return (a: string, b: string) => bb.poseidon2Hash([Fr.fromString(a), Fr.fromString(b)]).toString();
};

export class ProofManager {
  private proverPromise: Promise<ProverModules> | null = null;
  private verifierPromise: Promise<VerifierModules> | null = null;
  private circuitType: CircuitType;
  private circuit: CircuitConfig | null = null;

  constructor(circuitType: CircuitType) {
    this.circuitType = circuitType;
  }

  async initCircuit() {
    if (!this.circuit) {
      this.circuit = await getCircuitConfig(this.circuitType);
    }
  }

  async initProver(): Promise<ProverModules> {
    if (!this.proverPromise) {
      this.proverPromise = (async () => {
        const [{ Noir }, { UltraHonkBackend }] = await Promise.all([import("@noir-lang/noir_js"), import("@aztec/bb.js")]);
        return {
          Noir,
          UltraHonkBackend,
        };
      })();
    }
    return this.proverPromise;
  }

  async initVerifier(): Promise<VerifierModules> {
    if (!this.verifierPromise) {
      this.verifierPromise = (async () => {
        const { BarretenbergVerifier } = await import("@aztec/bb.js");
        return { BarretenbergVerifier };
      })();
    }
    return this.verifierPromise;
  }

  async verify(proofData: ProofData) {
    await this.initCircuit();
    if (!this.circuit) {
      throw new Error("Circuit not initialized");
    }

    const { BarretenbergVerifier } = await this.initVerifier();

    const verifier = new BarretenbergVerifier();

    const verify = await verifier.verifyUltraHonkProof(proofData, this.circuit.vkey);
    await verifier.destroy();

    return verify;
  }

  async generate(input: InputMap) {
    await this.initCircuit();
    if (!this.circuit) {
      throw new Error("Circuit not initialized");
    }

    const { Noir, UltraHonkBackend } = await this.initProver();

    const backend = new UltraHonkBackend(this.circuit.circuit.bytecode, {
      memory: {
        maximum: 0.5 * 1024 * 16,
      },
      threads: 1,
    });
    const noir = new Noir(this.circuit.circuit);

    const { witness } = await noir.execute(input);

    const proof = await backend.generateProof(witness);
    await backend.destroy();

    return proof;
  }
}

export const merkleMembership = new ProofManager(CircuitType.MerkleMembership);
