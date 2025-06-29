
import React from "react";
import { FileArchive } from "lucide-react";

const CompressorHeader: React.FC = () => {
  return (
    <header className="text-center mb-12 animate-fade-in">
      <div className="inline-flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <FileArchive className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Huffman Compression</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Compress your files using Huffman coding algorithm for efficient storage and transfer.
        </p>
      </div>
    </header>
  );
};

export default CompressorHeader;
