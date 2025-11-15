
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

export interface GameData {
  imageUrl: string;
  questions: string[];
}

export async function generateGameData(prompt: string): Promise<GameData> {
  if (!prompt) {
    throw new Error("Prompt cannot be empty.");
  }
  if (!process.env.GEMINI_API_KEY && !process.env.API_KEY) {
    throw new Error("GEMINI_API_KEY or API_KEY environment variable not set.");
  }

  try {
    // Parallelize API calls for image and questions
    const [imageResponse, questionsResponse] = await Promise.all([
      // Generate Image
      ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `cinematic, high detail, masterpiece: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      }),
      // Generate Questions
      ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Generate 5 creative and open-ended questions related to the theme: "${prompt}". These questions will be used for a game to unblur an image. Return the response as a valid JSON array of strings. Do not include any other text or markdown formatting.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
              description: 'A single creative question.'
            }
          },
        },
      })
    ]);

    // Process Image Response
    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
      throw new Error("Image generation failed.");
    }
    const firstImage = imageResponse.generatedImages[0];
    if (!firstImage || !firstImage.image?.imageBytes) {
      throw new Error("Image generation failed - invalid image data.");
    }
    const base64ImageBytes = firstImage.image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    // Process Questions Response
    const questionsText = questionsResponse.text?.trim();
    if (!questionsText) {
      throw new Error("Question generation failed - no response text.");
    }
    const questions = JSON.parse(questionsText);

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Question generation failed to return a valid array.");
    }

    return { imageUrl, questions };

  } catch (error) {
    console.error("Error generating game data:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate game data: ${error.message}`);
    }
    throw new Error("An unknown error occurred during game data generation.");
  }
}

export async function generateRoastMeme(questions: string[], answers: string[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY && !process.env.API_KEY) {
    throw new Error("GEMINI_API_KEY or API_KEY environment variable not set.");
  }

  try {
    // First, generate a roast text based on the answers
    const roastPrompt = `Based on these questions and answers, create a funny, lighthearted roast meme text. The roast should be playful and humorous, not mean-spirited. 

Questions: ${questions.join(', ')}
Answers: ${answers.join(', ')}

Generate a short, witty roast (1-2 sentences max) that playfully teases the person based on their answers. Make it meme-worthy and funny.`;

    const roastResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: roastPrompt,
      config: {
        temperature: 0.9,
      },
    });

    const roastText = roastResponse.text?.trim();
    if (!roastText) {
      throw new Error("Roast generation failed - no response text.");
    }

    // Generate a meme image with the roast text
    const memePrompt = `A funny internet meme style image with text overlay. The meme should have a humorous, playful roast message: "${roastText}". Style: classic meme format with bold text overlay, funny background, internet meme aesthetic, vibrant colors, text clearly visible.`;

    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: memePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
      throw new Error("Meme generation failed.");
    }

    const firstImage = imageResponse.generatedImages[0];
    if (!firstImage || !firstImage.image?.imageBytes) {
      throw new Error("Meme generation failed - invalid image data.");
    }
    const base64ImageBytes = firstImage.image.imageBytes;
    const memeUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return memeUrl;

  } catch (error) {
    console.error("Error generating roast meme:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate roast meme: ${error.message}`);
    }
    throw new Error("An unknown error occurred during roast meme generation.");
  }
}
