import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

export default LoadingSpinner;
