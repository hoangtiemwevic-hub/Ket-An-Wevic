import { GoogleGenAI } from "@google/genai";

// This is a new Vercel Serverless Function dedicated to validating an API key.
export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { apiKey } = request.body;
    
    if (!apiKey || typeof apiKey !== 'string') {
        return response.status(401).json({ error: 'API key is required for validation.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    // Perform a simple, low-cost request to check if the key is valid.
    // We are not interested in the response, only whether the call succeeds.
    await ai.models.generateContent({
        model: model,
        contents: "test",
    });

    // If the call succeeds, the key is valid.
    return response.status(200).json({ valid: true });

  } catch (error) {
    console.error("Error in /api/validate-key:", error);
    
    if (error instanceof Error) {
        // Handle specific, common errors with user-friendly messages
        if (error.message.includes('API key not valid')) {
            return response.status(401).json({ error: 'API key được cung cấp không hợp lệ. Vui lòng kiểm tra lại.' });
        }
        if (error.message.toLowerCase().includes('quota')) {
            return response.status(429).json({ error: 'Bạn đã vượt quá hạn ngạch sử dụng API. Vui lòng kiểm tra gói dịch vụ và thông tin thanh toán của bạn.' });
        }
        // For other errors, return the original message for debugging
        return response.status(500).json({ error: error.message });
    }

    return response.status(500).json({ error: 'Đã xảy ra lỗi không xác định trong quá trình xác thực key.' });
  }
}