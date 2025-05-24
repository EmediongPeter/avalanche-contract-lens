
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AnalysisProgressModal } from "./AnalysisProgressModal";
import { useAnalysisProgress } from "@/hooks/use-analysis-progress";
import { useUIStore, useAnalysisStore } from "@/state/store";
import { NetworkType, submitContractByAddress, startAnalysis } from "@/services/analysis";
import { toast } from "@/components/ui/use-toast";

// Define schema for form validation
const formSchema = z.object({
  contractAddress: z.string()
    .min(1, { message: "Contract address is required" })
    .regex(/^0x[a-fA-F0-9]{40}$/, { message: "Must be a valid Ethereum address" }),
  network: z.enum(["Avalanche Mainnet", "Fuji"] as const),
  slither: z.boolean().default(true),
  mythril: z.boolean().default(true),
  avalanche: z.boolean().default(true),
  gas: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function ContractAddressForm() {
  const { setAnalysisModalOpen } = useUIStore();
  const { contractAddress, network, analysisOptions, setContractAddress, setNetwork, setAnalysisOption } = useAnalysisStore();
  const [jobId, setJobId] = useState<string>("");
  const { startPolling, cancelAnalysis } = useAnalysisProgress(Number(jobId));
  
  // Initialize form with values from the store
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractAddress: contractAddress,
      network: network as "Avalanche Mainnet" | "Fuji",
      slither: analysisOptions.slither,
      mythril: analysisOptions.mythril,
      avalanche: analysisOptions.avalanche,
      gas: analysisOptions.gas,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Update store with form values
      setContractAddress(data.contractAddress);
      setNetwork(data.network);
      setAnalysisOption("slither", data.slither);
      setAnalysisOption("mythril", data.mythril);
      setAnalysisOption("avalanche", data.avalanche);
      setAnalysisOption("gas", data.gas);
      
      // Open the analysis modal
      setAnalysisModalOpen(true);
      
      // Step 1: Submit contract by address
      const contractId = await submitContractByAddress(
        data.contractAddress,
        data.network
      );
      
      // Step 2: Start analysis
      const auditId = await startAnalysis(contractId, {
        slither: data.slither,
        mythril: data.mythril,
        avalanche: data.avalanche,
        gas: data.gas
      });
      
      // Set the audit ID and start polling
      setJobId(auditId.toString());
      startPolling(auditId);
      
      toast({
        title: "Analysis Started",
        description: "We're now analyzing your contract",
      });
    } catch (error) {
      console.error("Error starting analysis:", error);
      setAnalysisModalOpen(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start analysis",
        variant: "destructive"
      });
    }
  };
  
  const handleCancel = () => {
    cancelAnalysis();
    setAnalysisModalOpen(false);
    toast({
      title: "Analysis Cancelled",
      description: "You've cancelled the contract analysis",
      variant: "destructive",
    });
  };

  // Check if at least one analysis option is selected
  const atLeastOneSelected = form.watch("slither") || 
                            form.watch("mythril") || 
                            form.watch("avalanche") || 
                            form.watch("gas");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 bg-gray-850 border-gray-800">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contract Details</h3>
              
              <FormField
                control={form.control}
                name="contractAddress"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Contract Address *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0x..." 
                        {...field} 
                        className="bg-gray-900 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="network"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Network</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={(value: NetworkType) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-900 border-gray-700">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="Avalanche Mainnet">Avalanche Mainnet</SelectItem>
                        <SelectItem value="Fuji">Fuji</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
          
          <Card className="p-6 bg-gray-850 border-gray-800">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Analysis Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="slither"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Slither Analysis</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mythril"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mythril Analysis</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="avalanche"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Avalanche-Specific Rules</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gas"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Gas Analysis</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={!form.formState.isValid || !atLeastOneSelected}
            >
              Run Analysis
            </Button>
          </div>
        </form>
      </Form>
      
      <AnalysisProgressModal onCancel={handleCancel} jobId={jobId} />
    </>
  );
}
