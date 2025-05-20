
import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/state/store";
import { getAnalysisStatus, cancelAnalysis as cancelAnalysisService } from "@/services/analysis";

export function useAnalysisProgress(jobId?: string, interval = 1000) {
  const { setProgress, setLoading } = useUIStore();
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "polling" | "completed" | "error">("idle");
  const abortControllerRef = useRef<AbortController | null>(null);
  const jobIdRef = useRef<string | undefined>(jobId);
  const intervalIdRef = useRef<number | null>(null);

  // Update the job ID reference when the prop changes
  useEffect(() => {
    jobIdRef.current = jobId;
  }, [jobId]);

  // Function to start polling
  const startPolling = (newJobId?: string) => {
    // Use the provided job ID or fallback to the ref
    const activeJobId = newJobId || jobIdRef.current;
    
    if (!activeJobId) {
      console.error("Cannot start polling: No job ID provided");
      return;
    }
    
    // Update the ref if a new job ID was provided
    if (newJobId) {
      jobIdRef.current = newJobId;
    }
    
    setStatus("polling");
    setLoading(true);
    setError(null);
    
    // Reset abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    // Clear any existing interval
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
    }
    
    // Start polling the API
    intervalIdRef.current = window.setInterval(async () => {
      try {
        if (!jobIdRef.current) return;
        
        const response = await getAnalysisStatus(jobIdRef.current);
        setProgress(response.progress);
        
        if (response.progress >= 100) {
          setStatus("completed");
          setLoading(false);
          cancelPolling();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
        setStatus("error");
      }
    }, interval);
    
    // Store the interval ID for cleanup
    return () => cancelPolling();
  };

  // Function to cancel polling
  const cancelPolling = () => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    setStatus("idle");
  };

  // Method to cancel the current analysis
  const cancelAnalysis = async () => {
    if (jobIdRef.current) {
      try {
        await cancelAnalysisService(jobIdRef.current);
      } catch (err) {
        console.error("Failed to cancel analysis:", err);
      }
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    cancelPolling();
    setStatus("idle");
    setLoading(false);
    setProgress(0);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPolling();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    startPolling,
    cancelPolling,
    cancelAnalysis,
    status,
    error
  };
}
