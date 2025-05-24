
import { ethers } from "ethers";

export enum Network {
  AVALANCHE = "Avalanche Mainnet",
  FUJI = "Fuji Testnet",
  LOCAL = "Local Network"
}

const RPC_URLS = {
  [Network.AVALANCHE]: "https://api.avax.network/ext/bc/C/rpc",
  [Network.FUJI]: "https://api.avax-test.network/ext/bc/C/rpc",
  [Network.LOCAL]: "http://localhost:8545"
};

export const getProvider = (network: Network | string = Network.AVALANCHE) => {
  const url = RPC_URLS[network as Network] || RPC_URLS[Network.AVALANCHE];
  return new ethers.JsonRpcProvider(url);
};

export const getContractCode = async (address: string, network: Network | string = Network.AVALANCHE) => {
  try {
    const provider = getProvider(network);
    const code = await provider.getCode(address);
    
    // If code is just "0x", it means the address is not a contract
    if (code === "0x") {
      throw new Error("Address is not a contract");
    }
    
    return code;
  } catch (error) {
    console.error("Error fetching contract code:", error);
    throw error;
  }
};

export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};
