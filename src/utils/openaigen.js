"use server";
import openai from "./openaimodel";

export const generateImage = async (FormData) => {
  try {
    const prompt = FormData;
    if (!prompt) {
      return { error: "Prompt is required" };
    }

    // Generate an image using OpenAI
    const res = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });

    const imageUrl = res.data[0].url;
    if (!imageUrl) {
      throw new Error("Image URL not found in response");
    }

    // Fetch the image using our API proxy to avoid CORS issues
    const proxyUrl = `/api/image?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    console.log('proxy', response, imageUrl);

    const blob = await response.blob();
    return { imageUrl, blob,  proxyUrl};
  } catch (error) {
    console.error("Error generating AI image:", error);
    return { error: error.message };
  }
};
