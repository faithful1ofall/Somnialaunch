"use server";
import openai from "./openaimodel";

export const generateCollectionTheme = async (userPrompt) => {
  try {
    if (!userPrompt) {
      return { error: "Prompt is required" };
    }

    // Generate structured collection theme
    const themePrompt = `
  Based on the prompt: ${userPrompt}, create a structured NFT collection theme.
  Return a JSON object with:
  - Collection name (max 50 chars)
  - Description (max 200 chars)
  - Art style (max 50 chars)
  - Layers with traits: Background, Characters, Clothing, Accessories (each max 100 chars)
  - Rarity distribution: Common, Rare, Epic, Legendary (max 50 chars each)
  
  Ensure the total response does not exceed 950 characters.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: themePrompt }],
      temperature: 0.7,
    });
    console.log('server response', response);

    if (!response.choices || !response.choices[0].message.content) {
      throw new Error(`No theme generated.`);
    }

    const collectionTheme = response.choices[0].message.content;

    return { success: true, collectionTheme, response };
  } catch (error) {
    console.error("Error generating NFT collection theme:", error);
    return { error: error.message };
  }
};

export const generateNFTCollection = async (collectionTheme, numNFTs = 10) => {
  try {
    if (!collectionTheme) {
      return { error: "Collection theme is required" };
    }

    // Step 1: Generate Images for all NFTs in one batch
    const imagePrompt = `${collectionTheme}, highly detailed, fantasy style, NFT artwork`;
    const imageRes = await openai.images.generate({
      prompt: imagePrompt,
      n: numNFTs,
      size: "512x512",
    });

    if (!imageRes.data || imageRes.data.length !== numNFTs) {
      throw new Error(`Expected ${numNFTs} images, but received ${imageRes.data.length}`);
    }

    const imageUrls = imageRes.data.map(img => img.url);

    // Step 2: Generate Metadata for all NFTs in one batch
    const metadataPrompt = `
      Create unique metadata for a set of ${numNFTs} NFTs called '${collectionTheme}'. 
      Each NFT should have attributes like Background, Clothing, Magic, Accessories, 
      and Special Effects. Provide output in JSON array format.
    `;

    const metadataRes = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: metadataPrompt }],
      temperature: 0.7,
    });

    if (!metadataRes.choices || !metadataRes.choices[0].message.content) {
      throw new Error(`No metadata generated for the collection`);
    }

    const metadataArray = JSON.parse(metadataRes.choices[0].message.content);

    if (!Array.isArray(metadataArray) || metadataArray.length !== numNFTs) {
      throw new Error(`Metadata response is not in the expected array format.`);
    }

    // Step 3: Fetch all images via proxy in parallel
    const nftCollection = await Promise.all(imageUrls.map(async (imageUrl, index) => {
      const proxyUrl = `/api/image?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch image ${index + 1}: ${response.statusText}`);
      }

      const blob = await response.blob();

      return {
        id: index + 1,
        imageUrl,
        proxyUrl,
        blob,
        metadata: metadataArray[index], // Assign metadata to the corresponding NFT
      };
    }));

    return { success: true, nftCollection };
  } catch (error) {
    console.error("Error generating NFT collection:", error);
    return { error: error.message };
  }
};

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
