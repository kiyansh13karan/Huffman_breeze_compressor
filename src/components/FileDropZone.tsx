
import React, { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  maxFileSizeMB?: number;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFileSelect,
  isProcessing,
  maxFileSizeMB = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragging(true);
  }, [isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    setError(null);
    
    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxFileSizeMB}MB limit`);
      return false;
    }
    
    return true;
  }, [maxFileSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isProcessing) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [isProcessing, onFileSelect, validateFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [isProcessing, onFileSelect, validateFile]);

  const openFileSelector = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelectedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className={cn(
        "drop-zone w-full h-64 flex flex-col items-center justify-center p-6 cursor-pointer transition-all",
        isDragging ? "drop-zone-active animate-pulse" : "",
        isProcessing ? "opacity-70 cursor-not-allowed" : "",
        "animate-fade-in"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileSelector}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        disabled={isProcessing}
      />
      
      <div className="text-center">
        {!selectedFile && !error && (
          <>
            <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <UploadCloud className="h-8 w-8 text-primary animate-bounce-in" />
            </div>
            <h3 className="mb-2 text-xl font-medium">Drag & Drop Your File</h3>
            <p className="text-muted-foreground mb-4">or click to browse files</p>
            <p className="text-xs text-muted-foreground">Max file size: {maxFileSizeMB}MB</p>
          </>
        )}
        
        {selectedFile && !error && (
          <div className="animate-scale-in">
            <div className="flex items-center justify-center mb-3">
              <span className="truncate max-w-[250px] font-medium">{selectedFile.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 h-6 w-6" 
                onClick={clearSelectedFile}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        
        {error && (
          <div className="text-destructive animate-scale-in">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2" 
              onClick={clearSelectedFile}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDropZone;
