import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">如何获取 Sysdiagnose 日志</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-gray-300">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-400">在 iPad 或 iPhone 上</h3>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>同时按住**两个音量键**和**电源键（侧边按钮）** 1 到 1.5 秒。</li>
              <li>你会感觉到短暂的振动（触觉反馈）。如果出现“滑动关机”界面，说明按太久了——取消并重试。</li>
              <li>等待约 **10 分钟**。系统正在后台收集日志，屏幕上不会有任何提示。</li>
              <li>前往 **设置 > 隐私与安全性 > 分析与改进 > 分析数据**。</li>
              <li>找到名为 <code>sysdiagnose_...</code> 的文件（通常在列表顶部或底部）。</li>
              <li>点击它，然后点击右上角的 **分享图标**，将其保存到“文件”或 AirDrop 到电脑。</li>
            </ol>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mt-4">
            <p className="text-yellow-200 text-sm">
              <strong>注意：</strong> 该文件通常是 <code>.tar.gz</code> 格式，可能超过 200MB。我们在您的浏览器本地处理它以提取文本线索，只将相关片段发送给 AI。
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
          >
            明白了
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionModal;