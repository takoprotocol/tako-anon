import { TakoAnonSDK } from "@takoprotocol/anon-sdk";
import { createContext, useContext, ReactNode, useMemo } from "react";

interface SDKContextValue {
  sdk: TakoAnonSDK;
}

interface SDKProviderProps {
  children: ReactNode;
  apiUrl?: string;
}

export const SDKContext = createContext<SDKContextValue | null>(null);

export const SDKProvider: React.FC<SDKProviderProps> = ({ children, apiUrl }) => {
  const sdk = useMemo(() => new TakoAnonSDK(apiUrl), [apiUrl]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SDKContextProvider = SDKContext.Provider as any;
  return (
    <div>
      <SDKContextProvider value={{ sdk }}>{children}</SDKContextProvider>
    </div>
  );
};

export const useSDK = () => {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error("useSDK must be used within an SDKProvider");
  }
  return context;
};
