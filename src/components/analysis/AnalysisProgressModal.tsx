
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUIStore } from "@/state/store";

interface AnalysisProgressModalProps {
  onCancel: () => void;
  jobId?: string;
}

export function AnalysisProgressModal({ onCancel, jobId }: AnalysisProgressModalProps) {
  const { progress, analysisModalOpen, setAnalysisModalOpen } = useUIStore();
  const shouldReduceMotion = useReducedMotion();
  const [statusMessage, setStatusMessage] = useState<string>("Running Slither Analysis...");

  // Update status message based on progress
  useEffect(() => {
    if (progress < 30) {
      setStatusMessage("Running Slither Analysis...");
    } else if (progress < 60) {
      setStatusMessage("Running Mythril Analysis...");
    } else if (progress < 90) {
      setStatusMessage("Checking Avalanche-specific rules...");
    } else if (progress < 100) {
      setStatusMessage("Finalizing results...");
    } else {
      setStatusMessage("Analysis Complete");
      
      // Auto-dismiss modal after completion
      const timer = setTimeout(() => {
        setAnalysisModalOpen(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [progress, setAnalysisModalOpen]);

  const handleCancel = () => {
    onCancel();
    setAnalysisModalOpen(false);
  };

  return (
    <Dialog open={analysisModalOpen} onOpenChange={setAnalysisModalOpen}>
      <DialogContent 
        className="bg-gray-900 border-gray-800 text-white max-w-md mx-auto p-6" 
        aria-labelledby="analysis-title"
        aria-describedby="analysis-description"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={shouldReduceMotion ? {} : {
              rotate: 360
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center"
          >
            <Loader className="h-12 w-12 text-red-500" />
          </motion.div>
        </div>
        
        <DialogTitle id="analysis-title" className="text-xl font-semibold text-center mb-2">
          Analyzing Contract...
        </DialogTitle>
        
        <DialogDescription id="analysis-description" className="text-gray-400 text-center mb-6">
          This may take a few minutes
        </DialogDescription>
        
        <div className="my-4" aria-live="polite">
          <Progress 
            value={progress} 
            className="h-2 bg-gray-800" 
            indicatorClassName="bg-red-500"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          />
        </div>
        
        <div className="text-center text-sm text-gray-400 mb-6" aria-live="polite">
          {statusMessage} ({progress}%)
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-gray-800"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
