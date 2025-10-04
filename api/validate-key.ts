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
    
    // Provide a specific, user-friendly error message for invalid keys.
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return response.status(401).json({ error: 'The provided API key is not valid. Please check and try again.' });
    }
    
    // For other errors, return a more generic server error message.
    return response.status(500).json({ error: 'An internal server error occurred during key validation.' });
  }
}
