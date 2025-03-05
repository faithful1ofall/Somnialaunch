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

    // Extract image URL
    const imageUrl = res.data[0].url;
    if (!imageUrl) {
      throw new Error("Image URL not found in response");
    }

    // Fetch the image and convert to blob
    const response = await fetch(imageUrl, { mode: "cors" }); // Ensure CORS is allowed
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
//    const imageFile = new File([blob], `${Date.now()}_ai.png`, { type: "image/png" });

    return { blob };
  } catch (error) {
    console.error("Error generating AI image:", error);
    return { error: error.message };
  }
};
