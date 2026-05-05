import { GoogleGenAI, Type } from "@google/genai";
import { Habit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getHabitSuggestions(existingHabits: Habit[]) {
  const habitNames = existingHabits.map(h => h.name).join(', ');
  
  const prompt = existingHabits.length > 0 
    ? `Based on these existing habits: ${habitNames}, suggest 3 new complementary habits that would improve a high-performance lifestyle. Return in JSON format.`
    : `Suggest 5 fundamental daily habits for a productive and healthy life. Return in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING, description: "Lucide icon name" },
              color: { type: Type.STRING, description: "Tailwind color class like 'blue-500'" }
            },
            required: ["name", "description", "icon", "color"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}
