import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WeaponData } from "../types";

export const identifyWeapon = async (query: string): Promise<WeaponData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The official name of the weapon" },
      type: { type: Type.STRING, description: "The classification (e.g., Assault Rifle, MBT, Fighter Jet)" },
      manufacturer: { type: Type.STRING, description: "The primary manufacturer" },
      origin: { type: Type.STRING, description: "Country of origin" },
      year: { type: Type.STRING, description: "Year of introduction" },
      description: { type: Type.STRING, description: "A concise technical and historical summary (max 3 sentences)" },
      specs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: "Spec name (e.g. Caliber, Weight)" },
            value: { type: Type.STRING, description: "Spec value" },
          },
        },
        description: "Key technical specifications (4-6 items)",
      },
      isValidWeapon: { type: Type.BOOLEAN, description: "True if the query is a real or fictional weapon, False if it is gibberish or not a weapon." },
    },
    required: ["name", "type", "manufacturer", "origin", "year", "description", "specs", "isValidWeapon"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Identify and categorize the weapon: "${query}". Provide technical specifications.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as WeaponData;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze weapon data.");
  }
};