
import React, { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import FileDropZone from "@/components/FileDropZone";
import CompressionStats from "@/components/CompressionStats";
import CompressorHeader from "@/components/CompressorHeader";
import { compressionService, CompressionResult } from "@/api/compressionService";
import { Download, RefreshCw, Code } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setCompressionResult(null);
    setShowInfo(false);
  }, []);

  const handleCompression = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to compress",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setCompressionResult(null);

    try {
      const result = await compressionService.compressFile(selectedFile);
      setCompressionResult(result);
      
      toast({
        title: "Compression successful",
        description: `File compressed to ${((result.compressedSize / result.originalSize) * 100).toFixed(1)}% of original size`,
      });
      
      // Slight delay to show the animation
      setTimeout(() => setShowInfo(true), 300);
    } catch (error) {
      toast({
        title: "Compression failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!compressionResult || !selectedFile) return;
    
    try {
      await compressionService.downloadCompressedFile(
        compressionResult.compressedFileId,
        selectedFile.name
      );
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setCompressionResult(null);
    setShowInfo(false);
  };

  const toggleInfo = () => {
    setShowInfo(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
        <CompressorHeader />
        
        <div className="glass-panel p-8 mb-8 animate-fade-in">
          <FileDropZone 
            onFileSelect={handleFileSelect} 
            isProcessing={processing}
          />
          
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleCompression}
              disabled={!selectedFile || processing}
              className="button-hover-effect"
            >
              {processing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                "Compress File"
              )}
            </Button>
            
            {compressionResult && (
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="button-hover-effect"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
            
            {selectedFile && (
              <Button 
                variant="ghost"
                onClick={resetAll}
                className="text-muted-foreground"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
        
        {selectedFile && compressionResult && (
          <CompressionStats
            originalSize={compressionResult.originalSize}
            compressedSize={compressionResult.compressedSize}
            fileName={selectedFile.name}
            compressionRatio={compressionResult.compressionRatio}
            isVisible={showInfo}
          />
        )}
        
        <div className="mt-8 text-center opacity-70 hover:opacity-100 transition-opacity">
          <p className="text-xs text-muted-foreground">
            <Code className="inline h-3 w-3 mr-1" />
            Huffman compression algorithm is implemented on the server using Python.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
