
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

  // Connect to MetaMask or other EVM wallets
  const connectMetaMask = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      // Log connection attempt
      console.log('[Wallet] Attempting to connect to EVM wallet...');
      
      const ethereum = window.ethereum;
      
      // Check if ethereum is properly injected
      if (!ethereum) {
        throw new Error('No ethereum object found. Please refresh the page or reinstall MetaMask.');
      }
      
      // Request accounts with better error handling
      let accounts;
      try {
        accounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
      } catch (requestError: any) {
        // Handle specific MetaMask errors
        if (requestError.code === 4001) {
          throw new Error('You rejected the connection request. Please try again.');
        } else {
          throw requestError;
        }
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found or user rejected the request');
      }

      console.log(`[Wallet] Accounts received: ${accounts[0]}`);
      
      // Create provider and get signer
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      
      // Get network details
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      console.log(`[Wallet] Connected to network: ${network.name} (Chain ID: ${chainId})`);
      
      // Check if connected to a supported network
      const supportedChains = [1, 43113, 43114]; // Ethereum, Avalanche Fuji, Avalanche C-Chain
      if (!supportedChains.includes(chainId)) {
        console.warn(`[Wallet] Connected to unsupported network with chainId: ${chainId}`);
        toast.error(`Connected to unsupported network. Consider switching to Avalanche or Ethereum.`);
      }

      // Update wallet state
      setWallet({
        address: accounts[0],
        isConnected: true,
        chainId: chainId,
        provider,
        signer,
      });

      // Format address for toast message
      const formattedAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
      toast.success(`Connected to ${formattedAddress}`);
      
      // Log successful connection
      console.log(`[Wallet] Successfully connected to wallet: ${accounts[0]}`);
      
      return {
        address: accounts[0],
        chainId,
        provider,
        signer
      };
    } catch (error: any) {
      console.error('[Wallet] Failed to connect wallet:', error);
      toast.error('Failed to connect wallet: ' + (error.message || 'Unknown error'));
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, setWallet]);

  // Switch network
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!provider) {
      console.error('[Wallet] Cannot switch network: No provider available');
      toast.error('Cannot switch network. Please connect your wallet first.');
      return;
    }

    console.log(`[Wallet] Attempting to switch to network with chainId: ${chainId}`);
    
    try {
      // Convert chainId to hexadecimal with '0x' prefix
      const hexChainId = `0x${chainId.toString(16)}`;
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
      
      console.log(`[Wallet] Successfully switched to network with chainId: ${chainId}`);
    } catch (error: any) {
      console.error('[Wallet] Error switching network:', error);
      
      // Handle specific error cases
      if (error.code === 4902) {
        // Network not added to MetaMask - attempt to add it
        console.log('[Wallet] Network not found in wallet, attempting to add it');
        
        try {
          await addNetwork(chainId);
        } catch (addError) {
          console.error('[Wallet] Failed to add network:', addError);
          toast.error('Failed to add network to your wallet');
        }
      } else if (error.code === 4001) {
        // User rejected request
        toast.error('You rejected the network switch request');
      } else {
        toast.error(`Failed to switch network: ${error.message || 'Unknown error'}`);
      }
    }
  }, [provider]);
  
  // Add network to wallet
  const addNetwork = useCallback(async (chainId: number) => {
    if (!window.ethereum) return;
    
    let networkParams;
    
    // Define network parameters based on chainId
    switch (chainId) {
      case 43114: // Avalanche C-Chain
        networkParams = {
          chainId: '0xa86a', // 43114 in hex
          chainName: 'Avalanche C-Chain',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18
          },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/']
        };
        break;
      case 43113: // Avalanche Fuji Testnet
        networkParams = {
          chainId: '0xa869', // 43113 in hex
          chainName: 'Avalanche Fuji Testnet',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18
          },
          rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://testnet.snowtrace.io/']
        };
        break;
      default:
        throw new Error(`Network with chainId ${chainId} not supported for auto-add`);
    }
    
    console.log(`[Wallet] Adding network:`, networkParams);
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams]
    });
  }, []);

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
    addNetwork,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
