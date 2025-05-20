
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-background border-b border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col space-y-4 p-4 md:p-0">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-red-500">
              Avalanche Smart Contract Auditor
            </h1>
            <div className="hidden md:flex">
              <WalletConnectButton />
            </div>
          </div>
          
          <nav className="flex">
            <ul className="flex space-x-4 mb-0">
              <li>
                <Link
                  to="/"
                  className={cn(
                    "px-4 py-4 inline-block transition-colors",
                    isActive("/") 
                      ? "text-white border-b-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Analyze Contract
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className={cn(
                    "px-4 py-4 inline-block transition-colors",
                    isActive("/reports") 
                      ? "text-white border-b-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  My Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className={cn(
                    "px-4 py-4 inline-block transition-colors",
                    isActive("/statistics") 
                      ? "text-white border-b-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Statistics
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
