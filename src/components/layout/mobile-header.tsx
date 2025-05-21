
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileText, BarChart, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { motion, AnimatePresence } from "framer-motion";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", label: "Analyze", icon: <Upload className="w-5 h-5" /> },
    { path: "/reports", label: "Reports", icon: <FileText className="w-5 h-5" /> },
    { path: "/statistics", label: "Stats", icon: <BarChart className="w-5 h-5" /> }
  ];

  return (
    <>
      <header className="w-full bg-background/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between p-3">
            <h1 className="text-xl font-bold">
              <Link to="/" className="flex items-center gap-1">
                <span className="text-white font-extrabold">Avax</span>
                <span className="bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] bg-clip-text text-transparent">Audit</span>
              </Link>
            </h1>
            
            <div className="flex items-center gap-2">
              <WalletConnectButton size="sm" />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="ml-1"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.nav 
              className="absolute right-0 top-[56px] w-full max-w-[300px] bg-gray-900 border-l border-gray-800 h-[calc(100vh-56px)] overflow-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "tween" }}
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="flex flex-col p-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1",
                        isActive(item.path) 
                          ? "bg-gray-800/70 text-white border-l-2 border-red-500 font-medium" 
                          : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 z-20">
        <div className="flex items-center justify-around">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-1 flex-col items-center py-3 text-xs",
                isActive(item.path) 
                  ? "text-white" 
                  : "text-gray-400"
              )}
            >
              <div className={cn(
                "p-1 rounded-full mb-1",
                isActive(item.path) 
                  ? "bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61]" 
                  : "bg-transparent"
              )}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
