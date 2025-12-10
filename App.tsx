import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, Info } from 'lucide-react';
import Hero from './components/Hero';
import InstructionModal from './components/InstructionModal';
import ResultsView from './components/ResultsView';
import { parseSysdiagnose } from './services/logParser';
import { analyzeLogs } from './services/geminiService';
import { AppState, AnalysisResult } from './types';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setAppState(AppState.PARSING);

    try {
      // 1. Parse File locally
      const chunks = await parseSysdiagnose(file);
      
      // 2. Send to Gemini
      setAppState(AppState.ANALYZING);
      const result = await analyzeLogs(chunks);
      
      setAnalysisResult(result);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "处理过程中发生了意外错误。");
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0f172a] to-[#0f172a] text-slate-100 pb-20">
      
      {/* Navigation */}
      <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">P</div>
             <span className="font-bold text-xl tracking-tight">Pencil 寻笔助手</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-medium text-gray-400 hover:text-white flex items-center space-x-2 transition"
          >
            <Info className="w-4 h-4" />
            <span>如何获取日志？</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {appState === AppState.IDLE && (
          <div className="space-y-12 fade-in">
            <Hero />
            
            <div className="max-w-xl mx-auto">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-600 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 hover:border-blue-500 transition-all cursor-pointer overflow-hidden"
                >
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                    <UploadCloud className="w-16 h-16 text-slate-400 group-hover:text-blue-400 transition-transform group-hover:scale-110 duration-300 mb-4" />
                    <p className="text-lg font-medium text-gray-300">点击上传 sysdiagnose 文件</p>
                    <p className="text-sm text-gray-500 mt-2">支持 .tar.gz (最大 500MB，本地处理)</p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".gz,.tar,.log,.txt"
                    />
                </div>
            </div>
          </div>
        )}

        {(appState === AppState.PARSING || appState === AppState.ANALYZING) && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 animate-pulse">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                <Loader2 className="w-20 h-20 text-blue-500 animate-spin relative z-10" />
             </div>
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">
                    {appState === AppState.PARSING ? "正在提取数据..." : "正在咨询 AI..."}
                </h2>
                <p className="text-gray-400">
                    {appState === AppState.PARSING 
                        ? "我们正在本地扫描日志中的 'Apple Pencil' 事件..." 
                        : "神探正在分析时间戳和信号强度..."}
                </p>
             </div>
          </div>
        )}

        {appState === AppState.COMPLETE && analysisResult && (
          <ResultsView result={analysisResult} onReset={resetApp} />
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-xl mx-auto text-center mt-20 p-8 bg-red-500/10 border border-red-500/30 rounded-2xl">
             <h3 className="text-xl font-bold text-red-400 mb-2">分析失败</h3>
             <p className="text-gray-300 mb-6">{errorMsg}</p>
             <button 
                onClick={resetApp}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition border border-slate-600"
            >
                重试
             </button>
          </div>
        )}

      </main>

      <InstructionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}