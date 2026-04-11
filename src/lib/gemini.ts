import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

export async function chatWithGemini(history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Sei un assistente virtuale di una scuola interattiva. Aiuta gli studenti con i loro compiti, spiega concetti complessi in modo semplice e sii sempre incoraggiante e professionale. Rispondi in italiano.",
    });

    const chat = model.startChat({
      history: history.slice(0, -1), // Pass previous history
    });

    const lastMessage = history[history.length - 1].parts[0].text;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Si è verificato un errore nella comunicazione con l'AI. Verifica che la chiave API sia corretta.";
  }
}
