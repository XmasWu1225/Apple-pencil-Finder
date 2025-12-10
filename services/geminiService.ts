import { GoogleGenAI, Type } from "@google/genai";
import { ParsedLogChunk, AnalysisResult } from '../types';

const getClient = () => {
    // API Key is injected via environment variable as per instructions
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found in environment variables");
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzeLogs = async (chunks: ParsedLogChunk[]): Promise<AnalysisResult> => {
    const ai = getClient();
    
    // Combine logs for the prompt
    const logContent = chunks.map(c => `--- FILE: ${c.fileName} ---\n${c.content}`).join('\n\n');

    const prompt = `
    你是一名专业的 Apple 硬件技术员和数据取证分析师。
    我上传了一段来自 iPad/iPhone 的 "sysdiagnose" 日志片段。
    我的目标是找回丢失的 Apple Pencil。
    
    请分析以下蓝牙和系统日志。
    **重要提示：**
    Apple Pencil 的信息可能不会以明确的 "Connected" 或 "Disconnected" 事件出现。
    你需要寻找更隐晦的线索，例如：
    1. **statedump** (状态转储)：显示设备在某一时刻的快照。
    2. **LastSeen** 字段：这可能是一个时间戳或系统运行时间（Tick），表示最后一次检测到广播包的时间。
    3. **GAPName**：设备名称（如 "Apple Pencil Pro" 或 "ApplePencil"）。
    4. **Axxxx 型号代码**：例如 A2538, A2051 等。
    
    日志示例格式可能如下：
    \`statedump: ... -> ... GAPName: "Apple Pencil Pro", LastSeen: 25946174, LastConn: 314488 ...\`

    请分析并确定：
    1. **最后目击时间**：根据日志中的时间戳、LastSeen 字段或上下文推断出的最后一次确切时间。如果 LastSeen 是相对时间，请尝试根据日志中的其他绝对时间进行换算。
    2. **信号强度分析**：寻找 RSSI 值。如果只有 statedump，查看是否有关于信号质量的描述。
    3. **设备状态背景**：当时 iPad 在做什么？Pencil 是处于 "Paired"（已配对但断开）还是 "Connected" 状态？
    4. **电池信息**：如果有记录。

    以下是日志内容：
    ${logContent}

    请务必使用**中文（简体）**回答。
    请严格按照 JSON 格式输出。
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Flash is better for large context windows (logs)
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    lastSeenDate: { type: Type.STRING, description: "最后一次连接或被系统检测到（LastSeen）的可读日期和时间" },
                    locationContext: { type: Type.STRING, description: "推断的位置或活动（例如，“在家连接 WiFi X 时”，“移动中”，“未知”）" },
                    signalStrengthAnalysis: { type: Type.STRING, description: "丢失前 RSSI 信号数值或 LastSeen 数据的分析" },
                    batteryStatus: { type: Type.STRING, description: "最后已知的电池百分比或状态" },
                    confidenceLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                    summary: { type: Type.STRING, description: "关于发生了什么的对话式总结，请特别提及你是通过什么线索（如 statedump）发现的。" },
                    nextSteps: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "给用户的建议行动步骤" 
                    }
                }
            }
        }
    });

    const text = response.text;
    if (!text) {
        throw new Error("AI 没有响应");
    }

    try {
        return JSON.parse(text) as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON", e);
        throw new Error("AI 响应的不是有效的 JSON 格式");
    }
};