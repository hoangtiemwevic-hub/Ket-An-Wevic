import { Crime } from "../types";

export async function analyzeCrimeText(text: string): Promise<Crime[]> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Use the error message from the backend if available
      throw new Error(data.error || `Server responded with status: ${response.status}`);
    }

    // The backend wraps the result in a 'result' property.
    return data.result as Crime[];
  } catch (error) {
    console.error("Error calling analysis API:", error);
    // Re-throw the error so the component can catch it and display a message.
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while fetching analysis.");
  }
}
