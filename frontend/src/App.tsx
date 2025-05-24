
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { Header } from "@/components/layout/header";
import { MobileHeader } from "@/components/layout/mobile-header";
import AnalyzeContract from "./pages/AnalyzeContract";
import Reports from "./pages/Reports";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import toast, { Toaster as HotToaster } from 'react-hot-toast';

const App = () => {
  // Create a client once for the entire app
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HotToaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#F9FAFB',
                border: '1px solid #374151',
              },
              success: {
                style: {
                  background: 'linear-gradient(to right, #10B981, #059669)',
                },
              },
              error: {
                style: {
                  background: 'linear-gradient(to right, #EF4444, #DC2626)',
                },
              },
            }}
          />
          <div className="min-h-screen bg-background text-foreground">
            <BrowserRouter>
              <Header />
              <MobileHeader />
              <main className="min-h-[calc(100vh-16rem)]">
                <Routes>
                  <Route path="/" element={<AnalyzeContract />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
