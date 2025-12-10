import * as fflate from 'fflate';
import { ParsedLogChunk } from '../types';

// Expanded keywords to look for in the logs, including internal names and state dumps
const KEYWORDS = [
  'Apple Pencil', 'ApplePencil', 'Pencil', 'Stylus', 
  'Bluetooth', 'RSSI', 'disconnect', 'connect',
  'statedump', 'GAPName', 'LastSeen', 'LastConn',
  'A1603', 'A2051', 'A2538', 'A2539', 'A2633', // Known Pencil Model Numbers
  'IsMFiAuthenticated', 'EstablishedFastLeConnection'
];

/**
 * Helper to check if a file is a text log based on extension or name
 */
const isTextLog = (name: string): boolean => {
  const lower = name.toLowerCase();
  return (
    lower.endsWith('.log') ||
    lower.endsWith('.txt') ||
    lower.includes('bluetooth') ||
    lower.includes('system')
  );
};

/**
 * Filters large text content to only keep lines relevant to Apple Pencil
 */
const filterContent = (content: string, fileName: string): string => {
  const lines = content.split('\n');
  const relevantLines: string[] = [];
  
  // Context window optimization: specific log files are more dense
  const isBluetoothLog = fileName.toLowerCase().includes('bluetooth');

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check for specific strong signals of Pencil activity
    const hasPencilKeyword = 
        lowerLine.includes('apple pencil') || 
        lowerLine.includes('applepencil') ||
        lowerLine.includes('pencil') ||
        lowerLine.includes('stylus');

    // Check for technical identifiers (Model numbers like A2538)
    const hasModelIdentifier = 
        line.includes('A2538') || line.includes('A2051') || line.includes('A1603');

    // Check for state dumps which are very valuable but messy
    const hasStateDump = 
        (lowerLine.includes('statedump') || lowerLine.includes('lastseen')) && 
        (hasPencilKeyword || hasModelIdentifier || lowerLine.includes('gapname'));

    // If it's a dedicated bluetooth log, we're more lenient with general connectivity terms
    // but we prioritize lines that actually mention the device or its properties
    if (
      hasPencilKeyword || 
      hasModelIdentifier ||
      hasStateDump ||
      (isBluetoothLog && (
          (line.includes('Device') && line.includes('RSSI')) || 
          line.includes('Connect') || 
          line.includes('disconnect')
      ))
    ) {
      relevantLines.push(line.trim());
    }
  }

  // Limit to last 800 relevant lines (increased from 500) to ensure we catch state dumps
  if (relevantLines.length > 800) {
    return relevantLines.slice(relevantLines.length - 800).join('\n');
  }
  return relevantLines.join('\n');
};

/**
 * Main function to parse the uploaded file.
 * Since Sysdiagnose is usually tar.gz, we handle that.
 */
export const parseSysdiagnose = async (file: File): Promise<ParsedLogChunk[]> => {
  return new Promise((resolve, reject) => {
    const chunks: ParsedLogChunk[] = [];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      try {
        // 1. Decompress GZIP
        fflate.gunzip(uint8Array, (err, decompressed) => {
          if (err) {
            console.error("Gunzip error", err);
            // Fallback: maybe it's just a zip or just a tar? 
            // For this demo, we assume standard format or fail gracefully.
            reject(new Error("文件格式无效。请上传 .tar.gz 格式的 Sysdiagnose 文件。"));
            return;
          }

          // 2. Untar logic simulation for demo
          // In a real scenario, we would iterate through all files in the tarball.
          // Here we perform a heuristic scan on the decompressed stream as a proxy.
          
          const textDecoder = new TextDecoder();
          // Increase scan window to 20MB head and tail to catch more
          const sliceSize = 20 * 1024 * 1024;
          const head = decompressed.slice(0, sliceSize);
          const tail = decompressed.slice(Math.max(0, decompressed.length - sliceSize));
          
          const combinedText = textDecoder.decode(head) + "\n...[SKIPPED DATA]...\n" + textDecoder.decode(tail);
          
          const filtered = filterContent(combinedText, "combined_logs.txt");
          
          if (filtered.length < 50) {
              chunks.push({
                  fileName: "sysdiagnose_scan.log",
                  content: "No explicit 'Apple Pencil' records found in the quick scan window. AI will analyze general Bluetooth activity.",
                  relevanceScore: 1
              });
          } else {
              chunks.push({
                  fileName: "extracted_pencil_activity.log",
                  content: filtered,
                  relevanceScore: 10
              });
          }
          
          resolve(chunks);
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsArrayBuffer(file);
  });
};