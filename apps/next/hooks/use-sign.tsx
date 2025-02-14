import { useAccount } from "wagmi";
import { useSignMessage } from "wagmi";

function useSign() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  async function sign(message: string) {
    if (address) {
      return signMessageAsync({ message });
    }
    throw "Not Connected";
  }

  async function signTimestamp() {
    const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 1440;
    const signature = await sign(`tako:authorization:${deadline}`);
    return {
      addr: address,
      deadline,
      signature: signature ?? "",
    };
  }

  return {
    address,
    signTimestamp,
    sign,
  };
}

export default useSign;
