
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, FileText, FileMinus, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CompressionStatsProps {
  originalSize: number;
  compressedSize: number;
  fileName: string;
  compressionRatio: number;
  isVisible: boolean;
}

export const CompressionStats: React.FC<CompressionStatsProps> = ({
  originalSize,
  compressedSize,
  fileName,
  compressionRatio,
  isVisible
}) => {
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
  
  const savingsPercentage = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  
  return (
    <div 
      className={cn(
        "glass-panel p-6 transition-all",
        isVisible ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8",
      )}
    >
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <FileText className="mr-2 h-5 w-5 text-primary" />
        Compression Results
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">File name</span>
          <span className="font-medium truncate max-w-[200px]">{fileName}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Original Size</p>
            <p className="font-medium">{formatFileSize(originalSize)}</p>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Compressed Size</p>
            <p className="font-medium">{formatFileSize(compressedSize)}</p>
          </div>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileMinus className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Space Saved</span>
            </div>
            <div className="flex items-center">
              <Percent className="mr-1 h-3 w-3" />
              <span className="font-medium">{savingsPercentage}%</span>
            </div>
          </div>
          <Progress value={parseFloat(savingsPercentage)} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Compression Ratio</span>
          <span className="font-medium">1:{compressionRatio.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-center text-primary">
          <ArrowDown className="mr-2 h-4 w-4" />
          <span className="font-medium text-sm">
            {formatFileSize(originalSize - compressedSize)} smaller
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompressionStats;
