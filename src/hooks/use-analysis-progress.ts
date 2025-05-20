
import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/state/store";

export function useAnalysisProgress(jobId?: string, interval = 1000) {
  const { setProgress, setLoading } = useUIStore();
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "polling" | "completed" | "error">("idle");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Start polling function
  const startPolling = () => {
    if (!jobId) return;
    
    setStatus("polling");
    setLoading(true);
    setError(null);
    
    // Reset abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    // For demo purposes, we're simulating progress updates
    // In a real app, this would fetch from an API endpoint
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 1;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setStatus("completed");
        setLoading(false);
      }
      
      setProgress(currentProgress);
    }, interval);
    
    // Store the timer ID for cleanup
    const timerId = timer;
    
    // Cleanup function
    return () => {
      clearInterval(timerId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  };

  // Method to cancel the current analysis
  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("idle");
    setLoading(false);
    setProgress(0);
  };

  // In a real implementation, we would poll an API endpoint here
  // For demonstration, we use the simulated progress above
  
  return {
    startPolling,
    cancelAnalysis,
    status,
    error
  };
}
