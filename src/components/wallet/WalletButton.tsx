
import { useState } from 'react';
import { ChevronDown, Wallet, LogOut, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/hooks/use-wallet';
import { cn } from '@/lib/utils';

export function WalletButton() {
  const { 
    address, 
    isConnected, 
    chainId, 
    isConnecting, 
    connectMetaMask, 
    disconnectWallet,
    switchNetwork,
    isMetaMaskInstalled 
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = (id: number | null) => {
    switch (id) {
      case 43114: return 'Avalanche';
      case 43113: return 'Fuji';
      case 1: return 'Ethereum';
      default: return 'Unknown';
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <Button
        onClick={() => window.open('https://metamask.io/download/', '_blank')}
        className="bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] hover:from-[#FF2E2E] hover:to-[#FF5F51] text-white border-0"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Install MetaMask
      </Button>
    );
  }

  if (!isConnected) {
    return;
    // (
    //   <Button
    //     onClick={connectMetaMask}
    //     disabled={isConnecting}
    //     className="bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] hover:from-[#FF2E2E] hover:to-[#FF5F51] text-white border-0"
    //   >
    //     <Wallet className="w-4 h-4 mr-2" />
    //     {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    //   </Button>
    // );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(address!)}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
        <div className="p-2">
          <p className="text-sm font-medium text-white">{formatAddress(address!)}</p>
          <p className="text-xs text-gray-400 flex items-center mt-1">
            <Network className="w-3 h-3 mr-1" />
            {getNetworkName(chainId)}
          </p>
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={() => switchNetwork(43114)}
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <Network className="w-4 h-4 mr-2" />
          Switch to Avalanche
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchNetwork(43113)}
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <Network className="w-4 h-4 mr-2" />
          Switch to Fuji
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={disconnectWallet}
          className="text-red-400 hover:text-red-300 hover:bg-gray-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
