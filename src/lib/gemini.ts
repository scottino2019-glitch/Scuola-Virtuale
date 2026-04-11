import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithGemini(history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: history,
      config: {
        systemInstruction: "Sei un assistente virtuale di una scuola interattiva. Aiuta gli studenti con i loro compiti, spiega concetti complessi in modo semplice e sii sempre incoraggiante e professionale. Rispondi in italiano.",
      }
    });
    return response.text || "Scusa, non ho capito. Puoi ripetere?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Si è verificato un errore nella comunicazione con l'AI.";
  }
}
