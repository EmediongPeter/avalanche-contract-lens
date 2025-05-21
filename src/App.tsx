
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { Header } from "@/components/layout/header";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useIsMobile } from "@/hooks/use-mobile";
import AnalyzeContract from "./pages/AnalyzeContract";
import Reports from "./pages/Reports";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const App = () => {
  // Create a client with non-React dependencies
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  const isMobile = useIsMobile();

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton richColors />
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <BrowserRouter>
              {isMobile ? <MobileHeader /> : <Header />}
              <main className="flex-1 w-full py-6 px-4 md:px-0">
                <Routes>
                  <Route path="/" element={<AnalyzeContract />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <footer className="w-full py-6 border-t border-gray-800">
                <div className="container mx-auto text-center text-xs text-gray-500">
                  <p>© {new Date().getFullYear()} AvaxAudit | Smart Contract Security Analysis Platform</p>
                </div>
              </footer>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
