"use client";

import { FC, PropsWithChildren } from "react";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { http } from "wagmi";

import { baseSepolia, base, BASE_MAINNET_RPC_URL, BASE_SEPOLIA_RPC_URL } from "../utils/chain";

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

//const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID as string;

const config = getDefaultConfig({
  appName: 'GLEE',
  projectId: "cb51ad1ec3ea318b8c494b7811232d69",
  chains: [base],
  ssr: true,
  syncConnectedChain: true,
  transports: {
    [base.id]: http(BASE_MAINNET_RPC_URL),
  },
});

const queryClient = new QueryClient();

const Web3Provider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={darkTheme()} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);


export default Web3Provider;
