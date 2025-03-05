'use server'
import openai from './openaimodel'

  export const  generateImage = async (FormData) => {
    const prompt = formData.get('prompt');
    if (!prompt) {
      return { error: 'Prompt is required' }
    }
  
    // generate an image using openai
  
    const res = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: '512x512',
    }) 
  return JSON.parse(JSON.stringify(res));
}
