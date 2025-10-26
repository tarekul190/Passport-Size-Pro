
import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedImage } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const PASSPORT_PROMPTS = [
  "A professional passport-sized photo wearing a crisp white shirt, a black suit, and a classic black tie. The background should be plain white.",
  "Generate a studio-quality passport photo. The subject should be wearing a light blue formal shirt with a dark navy blue suit. Plain off-white background.",
  "Create a passport-style headshot with the person wearing a simple, professional dark grey suit and a white shirt. No tie. Neutral, light grey background.",
  "Transform this into a formal passport photograph. The person is wearing a black suit and a patterned red tie over a white shirt, with a standard passport photo background.",
  "A professional passport-sized photo wearing a white shirt. The background should be plain white."
];

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generatePassportPhotos = async (files: File[]): Promise<GeneratedImage[]> => {
  const allGeneratedImages: GeneratedImage[] = [];

  for (const file of files) {
    const imagePart = await fileToGenerativePart(file);

    for (const prompt of PASSPORT_PROMPTS) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [imagePart, { text: prompt }],
          },
          config: {
            responseModalities: [Modality.IMAGE],
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
            allGeneratedImages.push({
              src: imageUrl,
              originalFileName: file.name,
              prompt: prompt,
            });
          }
        }
      } catch (error) {
        console.error(`Error generating image for ${file.name} with prompt: "${prompt}"`, error);
        // Continue to the next prompt/file even if one fails
      }
    }
  }

  return allGeneratedImages;
};
