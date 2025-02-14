"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { SDKProvider } from "@takoprotocol/anon-react";

function RainbowProviders({ children }: { children: React.ReactNode }) {
  const config = getDefaultConfig({
    appName: "Tako Anon Test App",
    projectId: "2c98fe89ba39e25fc146fd746abafe87",
    chains: [base],
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SDKProvider apiUrl={process.env.NEXT_PUBLIC_API_URL}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </SDKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default RainbowProviders;
