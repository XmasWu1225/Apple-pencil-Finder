import React from 'react';
import { AnalysisResult } from '../types';
import { MapPin, Battery, Signal, Clock, CheckCircle } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsView: React.FC<Props> = ({ result, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4">神探分析报告</h2>
        <p className="text-lg text-gray-300 leading-relaxed italic">
          "{result.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Last Seen */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">最后目击时间</h3>
          </div>
          <p className="text-2xl font-mono text-blue-300">{result.lastSeenDate}</p>
          <p className="text-sm text-gray-400 mt-2">最后一次成功建立连接的时间。</p>
        </div>

        {/* Location Context */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
           <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">位置线索</h3>
          </div>
          <p className="text-gray-200">{result.locationContext}</p>
        </div>

        {/* Signal Analysis */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
           <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
                <Signal className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">信号分析</h3>
          </div>
          <p className="text-gray-200">{result.signalStrengthAnalysis}</p>
        </div>

        {/* Battery */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
           <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Battery className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">电池状态</h3>
          </div>
          <p className="text-gray-200">{result.batteryStatus}</p>
        </div>

      </div>

      {/* Next Steps */}
      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
        <h3 className="text-xl font-semibold text-white mb-6">建议行动</h3>
        <div className="space-y-4">
            {result.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">{step}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
            onClick={onReset}
            className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-gray-200 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
            分析另一个文件
        </button>
      </div>

    </div>
  );
};

export default ResultsView;