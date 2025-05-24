
import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/state/store";
import { getAnalysisStatus, cancelAnalysis as cancelAnalysisService, getAnalysisResults } from "@/services/analysis";
import { useToast } from "@/components/ui/use-toast";

export interface AnalysisProgressHookResult {
  error: Error | null;
  status: "idle" | "polling" | "completed" | "error";
  startPolling: (newAuditId?: number) => void;
  cancelPolling: () => void;
  cancelAnalysis: () => Promise<void>;
  getResults: () => Promise<any>;
}

export function useAnalysisProgress(auditId?: number, interval = 2000): AnalysisProgressHookResult {
  const { setProgress, setLoading } = useUIStore();
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "polling" | "completed" | "error">("idle");
  const abortControllerRef = useRef<AbortController | null>(null);
  const auditIdRef = useRef<number | undefined>(auditId);
  const intervalIdRef = useRef<number | null>(null);
  const maxRetries = 3;
  const retryDelayMs = 2000;
  const retryCountRef = useRef<number>(0);

  // Update the audit ID reference when the prop changes
  useEffect(() => {
    auditIdRef.current = auditId;
  }, [auditId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current !== null) {
        window.clearInterval(intervalIdRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Function to fetch status with retry logic
  const fetchStatus = async (id: number): Promise<{ progress: number; status: string }> => {
    try {
      return await getAnalysisStatus(id);
    } catch (err) {
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        console.log(`Retrying status fetch (${retryCountRef.current}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        return fetchStatus(id);
      }
      throw err;
    }
  };

  // Function to start polling
  const startPolling = (newAuditId?: number) => {
    // Use the provided audit ID or fallback to the ref
    const activeAuditId = newAuditId || auditIdRef.current;
    
    if (!activeAuditId) {
      console.error("Cannot start polling: No audit ID provided");
      toast({
        title: "Error",
        description: "Cannot start analysis: Missing audit ID",
        variant: "destructive"
      });
      return;
    }
    
    // Update the ref if a new audit ID was provided
    if (newAuditId) {
      auditIdRef.current = newAuditId;
    }
    
    setStatus("polling");
    setLoading(true);
    setError(null);
    retryCountRef.current = 0;
    
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
        if (!auditIdRef.current) return;
        
        const response = await fetchStatus(auditIdRef.current);
        setProgress(response.progress);
        
        // Check for completed or failed status
        if (response.status === "completed" || response.progress >= 100) {
          setStatus("completed");
          setLoading(false);
          setProgress(100); // Ensure 100% is shown when complete
          cancelPolling();
          toast({
            title: "Analysis Complete",
            description: "Your contract analysis is ready to view"
          });
        } else if (response.status === "failed") {
          setStatus("error");
          setLoading(false);
          cancelPolling();
          toast({
            title: "Analysis Failed",
            description: "There was a problem analyzing your contract",
            variant: "destructive"
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
        setStatus("error");
        setLoading(false);
        cancelPolling();
        toast({
          title: "Error",
          description: "Failed to get analysis status",
          variant: "destructive"
        });
      }
    }, interval);
  };

  // Function to cancel polling
  const cancelPolling = () => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  // Method to cancel the current analysis
  const cancelAnalysis = async () => {
    if (auditIdRef.current) {
      try {
        await cancelAnalysisService(auditIdRef.current);
        toast({
          title: "Analysis Cancelled",
          description: "You've cancelled the contract analysis"
        });
      } catch (err) {
        console.error("Failed to cancel analysis:", err);
        toast({
          title: "Error",
          description: "Failed to cancel analysis",
          variant: "destructive"
        });
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

  // Method to get analysis results
  const getResults = async () => {
    if (!auditIdRef.current) {
      throw new Error("No audit ID available");
    }
    
    try {
      return await getAnalysisResults(auditIdRef.current);
    } catch (err) {
      console.error("Failed to get analysis results:", err);
      toast({
        title: "Error",
        description: "Failed to fetch analysis results",
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    error,
    status,
    startPolling,
    cancelPolling,
    cancelAnalysis,
    getResults
  };
}
