
import React, { useState } from "react";
import { useAnalysisStore, useUIStore } from "@/state/store";
import { Button } from "@/components/ui/button";
import { ArrowUp, Check } from "lucide-react";
import { analyzeContract } from "@/services/analysis";
import { AnalysisOptions } from "@/components/analysis/analysis-options";
import { toast } from "sonner";

export function UploadSourceForm() {
  const [file, setFile] = useState<File | null>(null);
  const { analysisOptions, network } = useAnalysisStore();
  const { setLoading, setProgress, setAnalysisModalOpen } = useUIStore();
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file to analyze");
      return;
    }
    
    // Start analysis and show modal
    setLoading(true);
    setAnalysisModalOpen(true);
    setProgress(0);
    
    try {
      // Call the analyze API
      await analyzeContract(
        file,
        analysisOptions,
        network,
        (progress) => setProgress(progress)
      );
      
      // When complete
      toast.success("Analysis completed successfully");
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div 
        className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[200px]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center gap-2">
            <Check className="h-6 w-6 text-green-500" />
            <span className="text-white font-medium">{file.name}</span>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <ArrowUp className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-lg mb-2">Drag files here or click to upload</p>
            <p className="text-sm text-gray-400 mb-4">Supported formats: .sol, .vy, .json (Truffle/Hardhat)</p>
            <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
              Select File
            </Button>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              onChange={handleFileInput}
              accept=".sol,.vy,.json"
            />
          </>
        )}
      </div>
      
      <AnalysisOptions />
      
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={!file}
        >
          Run Analysis
        </Button>
      </div>
    </form>
  );
}
