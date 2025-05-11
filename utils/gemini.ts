
import axios from 'axios';

const { EXPO_PUBLIC_GEMINI_API_KEY } = process.env;

const systemPrompt = `
You are ChatNCook, a warm and knowledgeable AI cooking assistant.
You help users with:
- Ingredient substitutions
- Scaling recipes for servings
- Creating meal plans (vegan, keto, halal, gluten-free)
- Explaining cooking techniques clearly

Always respond in a friendly, helpful tone.
Give specific measurements when substituting ingredients.
Avoid vague answers. Be confident like a home chef helping a friend.
`;

export const getCookingAdviceGemini = async (
    userPrompt: string
): Promise<string | null> => {
    const fullPrompt = `${systemPrompt}\nUser: ${userPrompt}`;

    try {
        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${EXPO_PUBLIC_GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: fullPrompt }] }],
            }
        );
        return res.data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    } catch (error) {
        console.error('[Gemini Cooking Agent Error]', error);
        return null;
    }
};
