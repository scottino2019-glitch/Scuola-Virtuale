import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAiInstance() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please set it in the Secrets panel.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function chatWithGemini(history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history,
      config: {
        systemInstruction: "Sei un assistente virtuale di una scuola interattiva. Aiuta gli studenti con i loro compiti, spiega concetti complessi in modo semplice e sii sempre incoraggiante e professionale. Rispondi in italiano.",
      }
    });

    return response.text || "Nessuna risposta ricevuta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Si è verificato un errore nella comunicazione con l'AI. Per favore, riprova più tardi.";
  }
}
