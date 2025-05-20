
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAnalysisStore, useUIStore } from "@/state/store";
import { NetworkType } from "@/services/analysis";
import { analyzeContract } from "@/services/analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalysisOptions } from "@/components/analysis/analysis-options";
import { toast } from "sonner";

// Define the validation schema using Zod
const formSchema = z.object({
  contractAddress: z.string()
    .min(1, { message: "Contract address is required" })
    .regex(/^0x[a-fA-F0-9]{40}$/, { 
      message: "Invalid Ethereum address format. Must start with 0x followed by 40 hex characters." 
    }),
  network: z.enum(["Avalanche Mainnet", "Fuji", "Local"]),
});

type FormValues = z.infer<typeof formSchema>;

export function ContractAddressForm() {
  const { analysisOptions, setContractAddress, setNetwork } = useAnalysisStore();
  const { setLoading, setProgress, setAnalysisModalOpen } = useUIStore();
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractAddress: "",
      network: "Avalanche Mainnet",
    }
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setContractAddress(values.contractAddress);
    setNetwork(values.network as NetworkType);
    
    // Start analysis and show the modal
    setLoading(true);
    setAnalysisModalOpen(true);
    setProgress(0);
    
    try {
      // Call the analyze API
      await analyzeContract(
        values.contractAddress, 
        analysisOptions,
        values.network as NetworkType,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contractAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Contract Address*</FormLabel>
                <FormControl>
                  <Input
                    className="bg-gray-800 border-gray-700 focus:ring-red-500 focus:border-red-500"
                    placeholder="0x..."
                    {...field}
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
              <FormItem>
                <FormLabel className="text-sm font-medium">Network*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-red-500">
                      <SelectValue placeholder="Select a network" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="Avalanche Mainnet">Avalanche Mainnet</SelectItem>
                    <SelectItem value="Fuji">Fuji</SelectItem>
                    <SelectItem value="Local">Local</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <AnalysisOptions />
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Run Analysis
          </Button>
        </div>
      </form>
    </Form>
  );
}
