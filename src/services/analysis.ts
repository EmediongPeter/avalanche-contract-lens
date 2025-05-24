
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export type NetworkType = "Avalanche Mainnet" | "Fuji" | string;

export interface AnalysisOptions {
  slither: boolean;
  mythril: boolean;
  avalanche: boolean;
  gas: boolean;
}

export interface AnalysisResult {
  id: number;
  contract_id: number;
  contract_name: string;
  contract_address?: string;
  network: string;
  created_at: string;
  updated_at: string;
  status: "completed" | "in_progress" | "failed";
  issues: {
    critical: { count: number; items: Issue[] };
    high: { count: number; items: Issue[] };
    medium: { count: number; items: Issue[] };
    low: { count: number; items: Issue[] };
    info: { count: number; items: Issue[] };
  };
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  location: string;
  code?: string;
  rule_id: string;
}

// Convert frontend network names to backend network identifiers
const getNetworkIdentifier = (network: NetworkType): string => {
  switch (network) {
    case "Avalanche Mainnet":
      return "mainnet";
    case "Fuji":
      return "testnet";
    default:
      return "mainnet";
  }
};

// Map analysis options to backend analyzer list
const getAnalyzersList = (options: AnalysisOptions): string[] => {
  const analyzers: string[] = [];
  
  if (options.slither) analyzers.push("slither");
  if (options.mythril) analyzers.push("mythril");
  if (options.avalanche) analyzers.push("custom");
  if (options.gas) analyzers.push("gas analysis");
  
  return analyzers;
};

// Submit contract by address
export const submitContractByAddress = async (
  address: string,
  network: NetworkType
): Promise<number> => {
  try {
    const response = await apiClient.post('/contracts/fetch', {
      address,
      network: getNetworkIdentifier(network)
    });
    
    return response.data.contract_id;
  } catch (error) {
    console.error('Error submitting contract by address:', error);
    throw error;
  }
};

// Upload contract source
export const uploadContractSource = async (
  formData: FormData
): Promise<number> => {
  try {
    // Using multipart/form-data for file upload
    const response = await apiClient.post('/contracts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.contract_id;
  } catch (error) {
    console.error('Error uploading contract source:', error);
    throw error;
  }
};

// Start contract analysis
export const startAnalysis = async (
  contractId: number,
  options: AnalysisOptions
): Promise<number> => {
  try {
    const response = await apiClient.post('/audits/start', {
      contract_id: contractId,
      analyzers: getAnalyzersList(options),
      priority: "normal"
    });
    
    return response.data.audit_id;
  } catch (error) {
    console.error('Error starting analysis:', error);
    throw error;
  }
};

// Get analysis status
export const getAnalysisStatus = async (auditId: number): Promise<{ progress: number; status: string }> => {
  try {
    const response = await apiClient.get(`/audits/${auditId}`);
    
    return {
      progress: response.data.progress,
      status: response.data.status
    };
  } catch (error) {
    console.error('Error getting analysis status:', error);
    throw error;
  }
};

// Get analysis results
export const getAnalysisResults = async (auditId: number): Promise<AnalysisResult> => {
  try {
    const response = await apiClient.get(`/audits/${auditId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error getting analysis results:', error);
    throw error;
  }
};

// Cancel analysis
export const cancelAnalysis = async (auditId: number): Promise<void> => {
  try {
    await apiClient.post(`/audits/${auditId}/cancel`);
    toast.success('Analysis cancelled successfully');
  } catch (error) {
    console.error('Error cancelling analysis:', error);
    throw error;
  }
};

// List all reports with pagination
export const getReports = async (page: number = 1, limit: number = 10): Promise<AnalysisResult[]> => {
  try {
    const skip = (page - 1) * limit;
    const response = await apiClient.get(`/reports?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Type declaration for window object to store intervals (for backward compatibility)
declare global {
  interface Window {
    __analysisIntervals?: Record<string, number>;
  }
}
