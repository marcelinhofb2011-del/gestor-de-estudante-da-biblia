
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function getTeachingTips(lessonNumber: number, topic?: string): Promise<string> {
  const prompt = `Estou dirigindo um estudo bíblico do livro "Seja Feliz Para Sempre!", lição número ${lessonNumber}. 
  ${topic ? `O tópico atual é: ${topic}.` : ''}
  
  Por favor, forneça 3 dicas curtas e práticas para ensinar esta lição de forma eficaz. 
  Inclua uma pergunta de ponto de vista sugerida para engajar o estudante.
  A resposta deve ser encorajadora e formatada em Markdown.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching tips from Gemini API:", error);
    return "Não foi possível carregar as dicas de ensino no momento.";
  }
}
