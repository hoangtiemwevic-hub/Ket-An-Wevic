
import { GoogleGenAI, Type } from "@google/genai";
import type { Crime } from "../types";

// This is a Vercel Serverless Function, which acts as a backend.
// It securely handles the API key and communication with the Gemini API.

// Using `any` for request and response types to avoid adding @vercel/node dependency
// Vercel populates these with Node.js-like objects.
export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text, apiKey } = request.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return response.status(400).json({ error: 'Input text is required.' });
    }
    
    if (!apiKey || typeof apiKey !== 'string') {
        return response.status(401).json({ error: 'API key is required.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    const systemInstruction = `
      CRITICAL INSTRUCTIONS:
      1.  **Identify Subject and Crime**: Your task is to identify each individual person (the "subject") and extract the descriptions of crimes they are associated with directly from the provided text.
      2.  **100% Text-Based**: Your analysis must be based **exclusively and 100%** on the text provided. Do not use any external legal knowledge.
      3.  **No Inference or Generalization**: DO NOT infer, assume, generalize, or rephrase. If the text says "resisting the officers", the output must be "resisting the officers", not "resisting arrest".
      4.  **Exact Phrasing**: For the "english" value, you MUST use the exact verbatim phrase from the text that describes the criminal act.
      5.  **Subject Name**: For the "subject" value, use the name of the person mentioned. If a crime cannot be tied to a specific person, use the value "Unspecified".

      Based on these strict rules, analyze the following text about a criminal case in the United States.

      Return the answer as a JSON array of objects. Each object must have three keys: "subject" for the person's name, "english" for the crime name in English (extracted verbatim), and "vietnamese" for its Vietnamese translation.
      Only return the JSON array. Do not add any other text.

      Example for the text "John is accused of grand theft. Jane is accused of resisting the officers. A general charge of conspiracy was also filed.":
      [
        {"subject": "John", "english": "grand theft", "vietnamese": "Trộm cắp tài sản giá trị lớn"},
        {"subject": "Jane", "english": "resisting the officers", "vietnamese": "Chống người thi hành công vụ"},
        {"subject": "Unspecified", "english": "conspiracy", "vietnamese": "Âm mưu"}
      ]
    `;

    const contents = `
      Text to analyze:
      ---
      ${text}
      ---
    `;

    const geminiResponse = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              subject: {
                type: Type.STRING,
                description: "The name of the person associated with the crime. Use 'Unspecified' if no specific person is named."
              },
              english: {
                type: Type.STRING,
                description: "The verbatim phrase describing the crime in English, extracted directly from the text."
              },
              vietnamese: {
                type: Type.STRING,
                description: "The Vietnamese translation of the crime."
              }
            },
            required: ["subject", "english", "vietnamese"]
          }
        }
      }
    });

    const jsonText = geminiResponse.text.trim();
    if (!jsonText) {
      return response.status(200).json({ result: [] });
    }
    
    const parsedJson = JSON.parse(jsonText);

    if (!Array.isArray(parsedJson)) {
        console.error("Gemini API response is not an array:", parsedJson);
        return response.status(500).json({ error: "Failed to parse analysis from Gemini API: response is not an array." });
    }

    const result: Crime[] = parsedJson;
    return response.status(200).json({ result });

  } catch (error) {
    console.error("Error in /api/analyze:", error);
    let errorMessage = "An internal server error occurred.";
    if (error instanceof Error) {
        // Check for specific Gemini API authentication errors
        if (error.message.includes('API key not valid')) {
            return response.status(401).json({ error: 'The provided API key is not valid. Please check and try again.' });
        }
        errorMessage = error.message;
    }
    
    return response.status(500).json({ error: errorMessage });
  }
}