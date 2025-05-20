
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useUIStore } from "@/state/store";
import { AnimatedContent } from "@/components/ui/animated-content";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ContractAddressForm } from "@/components/analysis/ContractAddressForm";
import { UploadSourceForm } from "@/components/analysis/UploadSourceForm";

export default function AnalyzeContract() {
  const [activeTab, setActiveTab] = useState("upload");
  const { progress, analysisModalOpen, setAnalysisModalOpen } = useUIStore();
  
  return (
    <AnimatedContent>
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upload" className="text-base py-3">Upload Source</TabsTrigger>
                <TabsTrigger value="address" className="text-base py-3">Contract Address</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-0">
                <UploadSourceForm />
              </TabsContent>
              
              <TabsContent value="address" className="mt-0">
                <ContractAddressForm />
              </TabsContent>
            </Tabs>
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
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedContent>
  );
}
