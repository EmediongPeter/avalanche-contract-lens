
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useUIStore } from "@/state/store";
import { AnimatedContent } from "@/components/ui/animated-content";
import { ContractAddressForm } from "@/components/analysis/ContractAddressForm";
import { UploadSourceForm } from "@/components/analysis/UploadSourceForm";
import { AnalysisProgressModal } from "@/components/analysis/AnalysisProgressModal";
import { useAnalysisProgress } from "@/hooks/use-analysis-progress";

export default function AnalyzeContract() {
  const [activeTab, setActiveTab] = useState("upload");
  const { cancelAnalysis } = useAnalysisProgress();
  
  return (
    <AnimatedContent>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gradient text-center sm:text-left">Smart Contract Analysis</h1>
          
          <Card className="bg-gray-900 border-gray-800 card-glass overflow-hidden">
            <CardContent className="p-5 sm:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="upload" className="text-base py-3 transition-all">Upload Source</TabsTrigger>
                  <TabsTrigger value="address" className="text-base py-3 transition-all">Contract Address</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-0 animate-fade-in">
                  <UploadSourceForm />
                </TabsContent>
                
                <TabsContent value="address" className="mt-0 animate-fade-in">
                  <ContractAddressForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <AnalysisProgressModal onCancel={cancelAnalysis} />
        </div>
      </div>
    </AnimatedContent>
  );
}
