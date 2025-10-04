import { GoogleGenAI, Type } from "@google/genai";
// Fix: Moved Crime interface to types.ts and imported it here to centralize type definitions.
import { Crime } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeCrimeText(text: string): Promise<Crime[]> {
  try {
    const model = 'gemini-2.5-flash';

    // Fix: Moved prompt instructions to systemInstruction for better separation of concerns, as per Gemini API guidelines.
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

    const response = await ai.models.generateContent({
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
    
    // Fix: Improved type safety by checking if the parsed JSON is an array. This resolves downstream type errors in components.
    const jsonText = response.text.trim();
    if (!jsonText) {
      return [];
    }
    const parsedJson = JSON.parse(jsonText);

    if (!Array.isArray(parsedJson)) {
      console.error("Gemini API response is not an array:", parsedJson);
      throw new Error("Failed to parse analysis from Gemini API: response is not an array.");
    }
    
    return parsedJson as Crime[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Check if the error is related to parsing, which might indicate an unexpected API response format.
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the analysis from the API. The format was unexpected.");
    }
    throw new Error("Failed to get analysis from Gemini API.");
  }
}