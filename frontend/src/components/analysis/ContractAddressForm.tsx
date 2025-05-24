
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AnalysisProgressModal } from "./AnalysisProgressModal";
import { useAnalysisProgress } from "@/hooks/use-analysis-progress";
import { useUIStore, useAnalysisStore } from "@/state/store";
import { NetworkType, submitContractByAddress, startAnalysis } from "@/services/analysis";
import toast from 'react-hot-toast';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

// Analysis tool descriptions
const analysisDescriptions = {
  slither: "Static analysis framework for Solidity that detects vulnerabilities, optimization opportunities, and code quality issues.",
  mythril: "Security analysis tool that uses symbolic execution to find Ethereum smart contract vulnerabilities.",
  avalanche: "Custom analysis rules specifically designed for Avalanche C-Chain smart contracts and ecosystem patterns.",
  gas: "Gas usage optimization analysis to identify expensive operations and suggest improvements."
};

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
      toast.success("Analysis started successfully!");
      
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
      
    } catch (error) {
      console.error("Error starting analysis:", error);
      setAnalysisModalOpen(false);
      toast.error(error instanceof Error ? error.message : "Failed to start analysis");
    }
  };
  
  const handleCancel = () => {
    cancelAnalysis();
    setAnalysisModalOpen(false);
    toast.error("Analysis cancelled");
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
          <Card className="p-4 md:p-6 bg-gray-900/50 backdrop-blur-lg border-gray-700/50 rounded-2xl">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contract Details</h3>
              
              <FormField
                control={form.control}
                name="contractAddress"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-300">Contract Address *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0x..." 
                        {...field} 
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#FF3E3E] transition-colors"
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
                    <FormLabel className="text-gray-300">Network</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={(value: NetworkType) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-[#FF3E3E]">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Avalanche Mainnet" className="text-white hover:bg-gray-700">Avalanche Mainnet</SelectItem>
                        <SelectItem value="Fuji" className="text-white hover:bg-gray-700">Fuji Testnet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
          
          <Card className="p-4 md:p-6 bg-gray-900/50 backdrop-blur-lg border-gray-700/50 rounded-2xl">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Analysis Options</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {(['slither', 'mythril', 'avalanche', 'gas'] as const).map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name={option}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#FF3E3E] data-[state=checked]:to-[#FF6F61] border-gray-600"
                          />
                        </FormControl>
                        <div className="flex items-center space-x-2 flex-1">
                          <FormLabel className="text-gray-300 font-medium capitalize cursor-pointer">
                            {option === 'avalanche' ? 'Avalanche-Specific Rules' : `${option} Analysis`}
                          </FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent 
                              side="right" 
                              className="max-w-xs bg-gray-800 border-gray-700 text-white"
                            >
                              <p className="text-sm">{analysisDescriptions[option]}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              
              {!atLeastOneSelected && (
                <p className="text-sm text-amber-400 flex items-center space-x-2">
                  <Info className="w-4 h-4" />
                  <span>Please select at least one analysis option</span>
                </p>
              )}
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] hover:from-[#FF2E2E] hover:to-[#FF5F51] text-white border-0 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
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
