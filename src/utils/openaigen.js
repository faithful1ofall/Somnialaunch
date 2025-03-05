"use server";
import openai from "./openaimodel";

export const generateImage = async (FormData, noimg) => {
  try {
    const prompt = FormData;
    if (!prompt) {
      return { error: "Prompt is required" };
    }

    // Generate an image using OpenAI
    const res = await openai.images.generate({
      prompt: prompt,
      n: noimg || 1,
      size: "512x512",
    });

    
    return { res };
  } catch (error) {
    console.error("Error generating AI image:", error);
    return { error: error.message };
  }
};
