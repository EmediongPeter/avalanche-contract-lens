
import { useState } from "react";
import { ArrowUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useAnalysisStore, useUIStore } from "@/state/store";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function AnalyzeContract() {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState<File | null>(null);
  
  const { analysisOptions, setAnalysisOption, contractAddress, setContractAddress, network, setNetwork } = useAnalysisStore();
  const { isLoading, progress, analysisModalOpen, setAnalysisModalOpen, setProgress } = useUIStore();
  
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
  
  const handleRunAnalysis = () => {
    setAnalysisModalOpen(true);
    setProgress(0);
    
    // Simulate analysis progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setAnalysisModalOpen(false);
        }, 1000);
      }
    }, 300);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload" className="text-base py-3">Upload Source</TabsTrigger>
              <TabsTrigger value="address" className="text-base py-3">Contract Address</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-0">
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
            </TabsContent>
            
            <TabsContent value="address" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contract Address</label>
                  <input 
                    type="text" 
                    placeholder="0x..." 
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Network</label>
                  <select 
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                  >
                    <option value="Avalanche Mainnet">Avalanche Mainnet</option>
                    <option value="Fuji">Fuji</option>
                    <option value="Local">Local</option>
                  </select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Analysis Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="slither" 
                  checked={analysisOptions.slither}
                  onCheckedChange={(checked) => setAnalysisOption('slither', checked as boolean)}
                />
                <label htmlFor="slither" className="text-sm font-medium cursor-pointer">
                  Slither Analysis
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mythril" 
                  checked={analysisOptions.mythril}
                  onCheckedChange={(checked) => setAnalysisOption('mythril', checked as boolean)}
                />
                <label htmlFor="mythril" className="text-sm font-medium cursor-pointer">
                  Mythril Analysis
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="avalanche" 
                  checked={analysisOptions.avalanche}
                  onCheckedChange={(checked) => setAnalysisOption('avalanche', checked as boolean)}
                />
                <label htmlFor="avalanche" className="text-sm font-medium cursor-pointer">
                  Avalanche-Specific Rules
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gas" 
                  checked={analysisOptions.gas}
                  onCheckedChange={(checked) => setAnalysisOption('gas', checked as boolean)}
                />
                <label htmlFor="gas" className="text-sm font-medium cursor-pointer">
                  Gas Analysis
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleRunAnalysis}
              disabled={(!file && !contractAddress) || isLoading}
            >
              Run Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={analysisModalOpen} onOpenChange={setAnalysisModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogTitle>Analyzing Contract...</DialogTitle>
          <DialogDescription className="text-gray-400">
            This may take a few minutes
          </DialogDescription>
          
          <div className="my-4">
            <Progress value={progress} className="h-2 bg-gray-800" indicatorClassName="bg-red-500" />
          </div>
          
          <div className="text-center text-sm text-gray-400">
            {progress < 100 ? `Running Slither Analysis... (${progress}%)` : "Analysis Complete"}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => setAnalysisModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
