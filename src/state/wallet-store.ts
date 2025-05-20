
import { create } from "zustand";
import { ethers } from "ethers";

export interface WalletState {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  provider: any | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  isConnecting: false,
  isConnected: false,
  provider: null,
  chainId: null,
  
  connect: async () => {
    set({ isConnecting: true });
    
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet found");
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }
      
      const address = accounts[0];
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      set({ address, isConnected: true, provider, chainId, isConnecting: false });
      
      // Setup event listeners
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          get().disconnect();
        } else {
          set({ address: accounts[0] });
        }
      });
      
      window.ethereum.on("chainChanged", (chainId: string) => {
        set({ chainId: parseInt(chainId, 16) });
      });
      
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      set({ isConnecting: false });
      throw error;
    }
  },
  
  disconnect: () => {
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
    
    set({
      address: null,
      isConnected: false,
      provider: null,
      chainId: null
    });
  },
  
  switchNetwork: async (chainId: number) => {
    if (!window.ethereum) {
      throw new Error("No Ethereum wallet found");
    }
    
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error: any) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        // You would need to define network parameters for adding custom networks
        throw new Error("Chain not available. Please add it to your wallet.");
      }
      throw error;
    }
  }
}));

// Add type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
      on: (event: string, callback: any) => void;
      removeAllListeners: () => void;
    };
  }
}
