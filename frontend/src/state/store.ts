
import { create } from "zustand";
import { NetworkType, AnalysisResult } from "@/services/analysis";

// UI Store
interface UIState {
  isLoading: boolean;
  progress: number;
  analysisModalOpen: boolean;
  currentReport: AnalysisResult | null;
  setLoading: (isLoading: boolean) => void;
  setProgress: (progress: number) => void;
  setAnalysisModalOpen: (open: boolean) => void;
  setCurrentReport: (report: AnalysisResult | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  progress: 0,
  analysisModalOpen: false,
  currentReport: null,
  setLoading: (isLoading) => set({ isLoading }),
  setProgress: (progress) => set({ progress }),
  setAnalysisModalOpen: (open) => set({ analysisModalOpen: open }),
  setCurrentReport: (report) => set({ currentReport: report })
}));

// User Store
interface UserState {
  address: string | null;
  isConnected: boolean;
  setAddress: (address: string | null) => void;
  setConnected: (connected: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  address: null,
  isConnected: false,
  setAddress: (address) => set({ address }),
  setConnected: (connected) => set({ isConnected: connected })
}));

// Analysis Store
interface AnalysisOptions {
  slither: boolean;
  mythril: boolean;
  avalanche: boolean;
  gas: boolean;
}

interface AnalysisState {
  analysisOptions: AnalysisOptions;
  contractAddress: string;
  network: NetworkType;
  setAnalysisOption: (option: keyof AnalysisOptions, value: boolean) => void;
  setContractAddress: (address: string) => void;
  setNetwork: (network: NetworkType) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysisOptions: {
    slither: true,
    mythril: true,
    avalanche: true,
    gas: false
  },
  contractAddress: "",
  network: "Avalanche Mainnet",
  setAnalysisOption: (option, value) => set((state) => ({
    analysisOptions: {
      ...state.analysisOptions,
      [option]: value
    }
  })),
  setContractAddress: (address) => set({ contractAddress: address }),
  setNetwork: (network) => set({ network })
}));

// Reports Store
interface ReportsFilter {
  criticalOnly: boolean;
  highOnly: boolean;
  mediumLowOnly: boolean;
}

interface ReportsState {
  reports: AnalysisResult[];
  filter: ReportsFilter;
  addReport: (report: AnalysisResult) => void;
  setReports: (reports: AnalysisResult[]) => void;
  setFilter: (filter: Partial<ReportsFilter>) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  filter: {
    criticalOnly: false,
    highOnly: false,
    mediumLowOnly: false
  },
  addReport: (report) => set((state) => ({
    reports: [report, ...state.reports]
  })),
  setReports: (reports) => set({ reports }),
  setFilter: (filter) => set((state) => ({
    filter: {
      ...state.filter,
      ...filter
    }
  }))
}));
