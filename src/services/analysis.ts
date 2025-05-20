
import axios from 'axios';
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
  id: string;
  contract: string;
  network: string;
  timestamp: string;
  status: "Completed" | "Pending" | "Failed";
  issues: {
    critical: { count: number; items: Issue[] };
    high: { count: number; items: Issue[] };
    medium: { count: number; items: Issue[] };
    low: { count: number; items: Issue[] };
    info: { count: number; items: Issue[] };
  };
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  location: string;
  code?: string;
}

// Mock API (replace with real API calls in production)
export const analyzeContract = async (
  sourceInput: File | FormData | string,
  options: AnalysisOptions,
  network: NetworkType,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // In a real app, this would be an actual API call
  console.log('Analyzing contract with options:', options);
  console.log('Network:', network);

  // Return a simulated job ID
  const jobId = `job_${Math.random().toString(36).substring(2, 9)}`;

  // Simulate the analysis starting
  if (onProgress) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      onProgress(progress);
    }, 1000);
    
    // Store the interval for cleanup
    window.__analysisIntervals = window.__analysisIntervals || {};
    window.__analysisIntervals[jobId] = interval;
  }

  return Promise.resolve(jobId);
};

export const getAnalysisStatus = async (jobId: string): Promise<{ progress: number }> => {
  // In a real app, this would be an API call to check the status
  // For now, we'll just return a random progress value
  const progress = Math.min(99, Math.floor(Math.random() * 100));
  return Promise.resolve({ progress });
};

export const cancelAnalysis = async (jobId: string): Promise<void> => {
  // In a real app, this would be an API call to cancel the analysis
  console.log('Cancelling analysis job:', jobId);
  
  // Clear interval if it exists
  if (window.__analysisIntervals && window.__analysisIntervals[jobId]) {
    clearInterval(window.__analysisIntervals[jobId]);
    delete window.__analysisIntervals[jobId];
  }
  
  return Promise.resolve();
};

// Type declaration for window object to store intervals
declare global {
  interface Window {
    __analysisIntervals?: Record<string, number>;
  }
}
