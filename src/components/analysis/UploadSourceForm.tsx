
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadCloud, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalysisStore, useUIStore } from "@/state/store";
import { AnalysisOptions } from "@/components/analysis/analysis-options";
import { analyzeContract } from "@/services/analysis";
import { toast } from "sonner";
import { useAnalysisProgress } from "@/hooks/use-analysis-progress";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = {
  'application/json': ['.json'],
  'text/plain': ['.sol', '.vy'],
};

const FormSchema = z.object({
  files: z.array(
    z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than 2MB`,
    })
  ).min(1, { message: "At least one file is required" }),
  compilerVersion: z.string().min(1, { message: "Compiler version is required" }),
  optimization: z.enum(["Default", "O1", "O2", "O3"]),
});

type FormValues = z.infer<typeof FormSchema>;

// Mock compiler versions - in a real app, these would come from an API
const compilerVersions = [
  "0.8.19",
  "0.8.18",
  "0.8.17",
  "0.8.16",
  "0.7.6",
  "0.6.12",
];

export function UploadSourceForm() {
  const { analysisOptions, network } = useAnalysisStore();
  const { setAnalysisModalOpen, setProgress } = useUIStore();
  const { startPolling, cancelAnalysis } = useAnalysisProgress();
  
  const [isUploading, setIsUploading] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors, isValid } 
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      files: [],
      compilerVersion: "0.8.19",
      optimization: "Default",
    },
    mode: "onChange"
  });
  
  const files = watch("files");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      // Check if file extension is valid (.sol, .vy, or .json)
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !['sol', 'vy', 'json'].includes(ext)) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File too large: ${file.name}`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setValue("files", validFiles, { shouldValidate: true });
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    noClick: false,
    noKeyboard: false,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setValue("files", newFiles, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    setIsUploading(true);
    setAnalysisModalOpen(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      data.files.forEach((file) => formData.append("files", file));
      formData.append("compilerVersion", data.compilerVersion);
      formData.append("optimization", data.optimization);
      formData.append("network", network);
      
      Object.entries(analysisOptions).forEach(([option, isEnabled]) => {
        if (isEnabled) formData.append("analysisOptions[]", option);
      });
      
      // Start the analysis process
      const jobId = await analyzeContract(
        formData,
        analysisOptions,
        network,
        (progress) => setProgress(progress)
      );
      
      // Start polling for progress updates
      if (jobId) {
        startPolling(jobId);
      }
      
      toast.success("Analysis started successfully");
    } catch (error) {
      console.error("Analysis request failed:", error);
      toast.error("Failed to start analysis. Please try again.");
      setAnalysisModalOpen(false);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[200px] transition-colors focus-within:ring-2 focus-within:ring-red-500 outline-none
          ${isDragActive ? 'border-red-500 bg-red-500/5' : 'border-gray-700'}
          ${errors.files ? 'border-red-500' : ''}`}
        tabIndex={0}
        aria-label="File upload area"
      >
        <input {...getInputProps()} aria-label="File upload input" />
        
        {files.length > 0 ? (
          <div className="w-full">
            <div className="flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-white font-medium">{files.length} file(s) selected</span>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="mt-2"
            >
              Select More Files
            </Button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-lg mb-2">Drag files here or click to upload</p>
            <p className="text-sm text-gray-400 mb-4">Supported formats: .sol, .vy, .json (Truffle/Hardhat)</p>
            <p className="text-xs text-gray-500">Max file size: 2MB</p>
          </>
        )}
      </div>

      {/* File Preview List */}
      {files.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Selected Files</h3>
          <ul className="space-y-2" role="list" aria-label="Selected files">
            {files.map((file, index) => (
              <li 
                key={`${file.name}-${index}`} 
                className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2 group hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center overflow-hidden">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    file.name.endsWith('.sol') ? 'bg-blue-900' : 
                    file.name.endsWith('.vy') ? 'bg-purple-900' : 'bg-amber-900'
                  }`}>
                    <span className="text-xs font-bold text-white">
                      {file.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="opacity-70 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    removeFile(index);
                  }}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Compiler Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          <label htmlFor="compiler-version" className="block text-sm font-medium">
            Compiler Version
          </label>
          <Controller
            name="compilerVersion"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger id="compiler-version" className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select compiler version" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {compilerVersions.map((version) => (
                    <SelectItem key={version} value={version}>
                      {version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="optimization" className="block text-sm font-medium">
            Optimization Level
          </label>
          <Controller
            name="optimization"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger id="optimization" className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select optimization level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Default">Default</SelectItem>
                  <SelectItem value="O1">O1 (Basic)</SelectItem>
                  <SelectItem value="O2">O2 (Standard)</SelectItem>
                  <SelectItem value="O3">O3 (Maximum)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Analysis Options */}
      <AnalysisOptions />
      
      {/* Form Errors */}
      {errors.files && (
        <div className="flex items-center text-red-500 text-sm mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{errors.files.message}</span>
        </div>
      )}
      
      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <Button 
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={!isValid || isUploading || files.length === 0}
        >
          Run Analysis
        </Button>
      </div>
    </form>
  );
}
