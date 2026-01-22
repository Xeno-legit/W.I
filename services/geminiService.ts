import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WeaponData, SimilarWeapon } from "../types";

let currentApiKeyIndex = 0; // Track which API key is being used

export const getCurrentApiKey = (): number => currentApiKeyIndex;

const getApiKey = (index: number): string | undefined => {
  return index === 0 ? process.env.GEMINI_API_KEY : process.env.GEMINI_API_KEY_2;
};

export const identifyWeapon = async (query: string): Promise<WeaponData> => {
  const apiKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter(Boolean);
  
  if (apiKeys.length === 0) {
    throw new Error("No API Keys available. Please check your environment variables.");
  }

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
      suggestedName: { type: Type.STRING, description: "If the query appears to be a typo or nickname, provide the correct official weapon name. Leave empty if query is already correct or completely invalid." },
    },
    required: ["name", "type", "manufacturer", "origin", "year", "description", "specs", "isValidWeapon"],
  };

  // Try each API key in sequence
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    if (!apiKey) continue;

    try {
      console.log(`🔵 Attempting Gemini with API Key ${i + 1}...`);
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Identify and categorize the weapon: "${query}". If this appears to be a typo or nickname (e.g., "Ak7" instead of "AK-47", "deagle" instead of "Desert Eagle"), provide the correct name in suggestedName. Provide technical specifications.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");

      const data = JSON.parse(text) as WeaponData;
      currentApiKeyIndex = i;
      console.log(`✅ Using Gemini API Key ${i + 1}`);
      return data;

    } catch (error: any) {
      console.error(`❌ Gemini API Key ${i + 1} failed:`, error.message);
      
      // If this is the last key, throw the error
      if (i === apiKeys.length - 1) {
        throw new Error(error.message || "All Gemini API keys failed.");
      }
      // Otherwise, continue to next key
    }
  }

  throw new Error("All Gemini API keys failed.");
};

export const getSimilarWeapons = async (weaponName: string, weaponType: string): Promise<SimilarWeapon[]> => {
  const apiKey = getApiKey(currentApiKeyIndex);
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "The official name of the similar weapon" },
        type: { type: Type.STRING, description: "The weapon classification" },
        origin: { type: Type.STRING, description: "Country of origin" },
      },
      required: ["name", "type", "origin"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find 3 weapons similar to "${weaponName}" (a ${weaponType}). Return weapons from the same category with similar characteristics, role, or era. Provide diverse examples from different countries if possible.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as SimilarWeapon[];
    return data.slice(0, 3);

  } catch (error) {
    console.error("Gemini API Error (Similar Weapons):", error);
    return [];
  }
};