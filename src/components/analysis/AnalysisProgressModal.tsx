
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUIStore, useReportsStore } from "@/state/store";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

interface AnalysisProgressModalProps {
  onCancel: () => void;
  jobId?: string;
}

export function AnalysisProgressModal({ onCancel, jobId }: AnalysisProgressModalProps) {
  const { progress, analysisModalOpen, setAnalysisModalOpen, currentReport } = useUIStore();
  const { addReport } = useReportsStore();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [statusMessage, setStatusMessage] = useState<string>("Running Slither Analysis...");
  const [isCompleted, setIsCompleted] = useState(false);

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
      setStatusMessage("Analysis Complete!");
      setIsCompleted(true);
    }
  }, [progress]);

  const handleCancel = () => {
    onCancel();
    setAnalysisModalOpen(false);
    setIsCompleted(false);
  };

  const handleViewReport = () => {
    if (currentReport) {
      addReport(currentReport);
      navigate(`/reports/${currentReport.id}`);
      setAnalysisModalOpen(false);
      setIsCompleted(false);
      toast.success("Opening detailed report...");
    }
  };

  const handleViewAllReports = () => {
    if (currentReport) {
      addReport(currentReport);
    }
    navigate("/reports");
    setAnalysisModalOpen(false);
    setIsCompleted(false);
    toast.success("Navigating to reports page...");
  };

  return (
    <Dialog open={analysisModalOpen} onOpenChange={setAnalysisModalOpen}>
      <DialogContent 
        className="bg-gray-900 border-gray-800 text-white max-w-md mx-auto p-6" 
        aria-labelledby="analysis-title"
        aria-describedby="analysis-description"
      >
        <div className="flex justify-center mb-4">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500/20"
            >
              <CheckCircle className="h-12 w-12 text-green-500" />
            </motion.div>
          ) : (
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
          )}
        </div>
        
        <DialogTitle id="analysis-title" className="text-xl font-semibold text-center mb-2">
          {isCompleted ? "Analysis Complete!" : "Analyzing Contract..."}
        </DialogTitle>
        
        <DialogDescription id="analysis-description" className="text-gray-400 text-center mb-6">
          {isCompleted 
            ? "Your smart contract analysis is ready to view" 
            : "This may take a few minutes"
          }
        </DialogDescription>
        
        {!isCompleted && (
          <>
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
          </>
        )}
        
        <div className="flex justify-center space-x-3">
          {isCompleted ? (
            <>
              <Button 
                variant="outline" 
                className="border-gray-700 hover:bg-gray-800 flex items-center space-x-2"
                onClick={handleViewAllReports}
              >
                <span>View All Reports</span>
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] hover:from-[#FF2E2E] hover:to-[#FF5F51] flex items-center space-x-2"
                onClick={handleViewReport}
              >
                <FileText className="w-4 h-4" />
                <span>View Detailed Report</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="border-gray-700 hover:bg-gray-800"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
