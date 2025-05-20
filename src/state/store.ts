
import { create } from "zustand";

export type NetworkType = "Mainnet" | "Fuji" | "Local" | string;
export type AnalysisType = "Slither" | "Mythril" | "Avalanche-Specific" | "Gas";
export type IssueLevel = "Critical" | "High" | "Medium" | "Low" | "Info";

interface Report {
  id: string;
  contract: string;
  network: NetworkType;
  status: "Running" | "Completed" | "Failed";
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  date: string;
}

interface UIState {
  isLoading: boolean;
  progress: number;
  analysisModalOpen: boolean;
  currentReport: Report | null;
  setLoading: (isLoading: boolean) => void;
  setProgress: (progress: number) => void;
  setAnalysisModalOpen: (open: boolean) => void;
  setCurrentReport: (report: Report | null) => void;
}

interface UserState {
  address: string | null;
  isConnected: boolean;
  setAddress: (address: string | null) => void;
  setConnected: (connected: boolean) => void;
}

interface AnalysisState {
  analysisOptions: {
    slither: boolean;
    mythril: boolean;
    avalanche: boolean;
    gas: boolean;
  };
  contractAddress: string;
  network: NetworkType;
  setAnalysisOption: (option: keyof AnalysisState["analysisOptions"], value: boolean) => void;
  setContractAddress: (address: string) => void;
  setNetwork: (network: NetworkType) => void;
}

interface ReportsState {
  reports: Report[];
  filter: {
    criticalOnly: boolean;
    highOnly: boolean;
    mediumLowOnly: boolean;
  };
  addReport: (report: Report) => void;
  setReports: (reports: Report[]) => void;
  setFilter: (filter: Partial<ReportsState["filter"]>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  progress: 0,
  analysisModalOpen: false,
  currentReport: null,
  setLoading: (isLoading) => set({ isLoading }),
  setProgress: (progress) => set({ progress }),
  setAnalysisModalOpen: (open) => set({ analysisModalOpen: open }),
  setCurrentReport: (report) => set({ currentReport: report }),
}));

export const useUserStore = create<UserState>((set) => ({
  address: null,
  isConnected: false,
  setAddress: (address) => set({ address }),
  setConnected: (connected) => set({ isConnected: connected }),
}));

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysisOptions: {
    slither: true,
    mythril: true,
    avalanche: true,
    gas: false,
  },
  contractAddress: "",
  network: "Mainnet",
  setAnalysisOption: (option, value) => 
    set((state) => ({
      analysisOptions: {
        ...state.analysisOptions,
        [option]: value,
      },
    })),
  setContractAddress: (address) => set({ contractAddress: address }),
  setNetwork: (network) => set({ network }),
}));

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  filter: {
    criticalOnly: false,
    highOnly: false,
    mediumLowOnly: false,
  },
  addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
  setReports: (reports) => set({ reports }),
  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
}));
