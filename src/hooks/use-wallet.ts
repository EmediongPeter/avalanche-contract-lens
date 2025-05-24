
import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

// Wallet store
interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  setWallet: (wallet: Partial<WalletState>) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      chainId: null,
      provider: null,
      signer: null,
      setWallet: (wallet) => set((state) => ({ ...state, ...wallet })),
      disconnect: () => set({
        address: null,
        isConnected: false,
        chainId: null,
        provider: null,
        signer: null,
      }),
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({ 
        address: state.address, 
        isConnected: state.isConnected,
        chainId: state.chainId 
      }),
    }
  )
);

// Custom hook for wallet functionality
export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { address, isConnected, chainId, provider, signer, setWallet, disconnect } = useWalletStore();

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }, []);

  // Connect to MetaMask
  const connectMetaMask = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    try {
      const ethereum = window.ethereum;
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setWallet({
        address: accounts[0],
        isConnected: true,
        chainId: Number(network.chainId),
        provider,
        signer,
      });

      toast.success(`Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet: ' + (error.message || 'Unknown error'));
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, setWallet]);

  // Switch network
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!provider) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        toast.error('Please add this network to MetaMask first');
      } else {
        toast.error('Failed to switch network');
      }
    }
  }, [provider]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    disconnect();
    toast.success('Wallet disconnected');
  }, [disconnect]);

  // Listen for account and network changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== address) {
        setWallet({ address: accounts[0] });
        toast.success('Account changed');
      }
    };

    const handleChainChanged = (chainId: string) => {
      setWallet({ chainId: parseInt(chainId, 16) });
      toast.success('Network changed');
    };

    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [address, disconnectWallet, isMetaMaskInstalled, setWallet]);

  return {
    address,
    isConnected,
    chainId,
    provider,
    signer,
    isConnecting,
    connectMetaMask,
    disconnectWallet,
    switchNetwork,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
