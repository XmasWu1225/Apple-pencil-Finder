import React from 'react';
import { Search, FileSearch, Cpu } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-blue-500/10 rounded-full">
          <Search className="w-12 h-12 text-blue-400" />
        </div>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
        <span className="block">Apple Pencil 丢了吗？</span>
        <span className="block text-blue-500">让 AI 帮你找线索</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        上传您的 Apple <code>sysdiagnose</code> 文件。我们的 AI 将分析深层系统日志，精确定位您的 Apple Pencil 最后出现的的时间和地点。
      </p>
      
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <FileSearch className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">1. 上传日志</h3>
            <p className="text-sm text-gray-400">从您的 iPad/iPhone 设置中导出 sysdiagnose。</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">2. AI 分析</h3>
            <p className="text-sm text-gray-400">Gemini 智能扫描蓝牙 RSSI 信号和时间戳。</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <Search className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">3. 获取线索</h3>
            <p className="text-sm text-gray-400">找出它是在沙发缝里还是落在了咖啡店。</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;