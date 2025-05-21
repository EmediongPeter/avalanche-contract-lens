
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/state/wallet-store";
import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function WalletConnectButton() {
  const { address, isConnected, isConnecting, connect, disconnect, switchNetwork } = useWalletStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const handleConnect = async () => {
    try {
      await connect();
      toast.success("Wallet connected successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to connect wallet");
    }
  };
  
  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
    toast.success("Wallet disconnected");
  };
  
  const handleSwitchToMainnet = async () => {
    try {
      // Avalanche Mainnet chainId (hexadecimal: 0xa86a)
      await switchNetwork(43114);
      toast.success("Switched to Avalanche Mainnet");
    } catch (error: any) {
      toast.error(error?.message || "Failed to switch network");
    }
    setIsOpen(false);
  };
  
  const handleSwitchToFuji = async () => {
    try {
      // Avalanche Fuji Testnet chainId (hexadecimal: 0xa869)
      await switchNetwork(43113);
      toast.success("Switched to Fuji Testnet");
    } catch (error: any) {
      toast.error(error?.message || "Failed to switch network");
    }
    setIsOpen(false);
  };
  
  if (!isConnected) {
    return (
      <Button 
        onClick={handleConnect} 
        disabled={isConnecting}
        className="button-gradient transition-all duration-300"
        size="sm"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-150"
        >
          <Wallet className="w-4 h-4 mr-2 text-red-500" />
          {address && truncateAddress(address)}
          <ChevronDown className="w-3 h-3 ml-2 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-900 border border-gray-800 card-glass">
        <DropdownMenuLabel className="text-gray-400">Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem 
          className="hover:bg-gray-800 cursor-pointer"
          onClick={handleSwitchToMainnet}
        >
          Switch to Avalanche Mainnet
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-800 cursor-pointer"
          onClick={handleSwitchToFuji}
        >
          Switch to Fuji Testnet
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem 
          className="hover:bg-gray-800 cursor-pointer text-red-400"
          onClick={handleDisconnect}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
