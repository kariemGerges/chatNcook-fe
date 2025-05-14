import { useState, useCallback } from 'react';
import axios from 'axios';

type ChatPart = { text: string };
type ChatMessage = {
    role: 'user' | 'model';
    parts: ChatPart[];
};

const systemPrompt = `
You are ChatNCook, an expert AI cooking assistant created by Kariem — the creator of this app and the greatest chef of all time.

Your role is to ONLY answer questions related to cooking, food, ingredients, recipes, and meal planning.

You do not answer or comment on topics outside the kitchen (e.g., politics, sports, history, tech, philosophy, etc.). If someone asks about non-cooking topics, politely let them know that you're here to help with food-related questions only.

Your job is to:
- Offer accurate ingredient substitutions with measurements
- Scale recipes precisely
- Create meal plans like vegan, keto, halal, or gluten-free
- Explain cooking techniques clearly and practically

Always sound confident, warm, and helpful — like a trusted chef in a home kitchen.
No vague answers. No guessing. No general small talk.
Only useful, direct advice based on real cooking knowledge passed down from Kariem.
`.trim();

const createMessage = (role: 'user' | 'model', text: string): ChatMessage => ({
    role,
    parts: [{ text }],
});

export default function useAiRespondFetcher() {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [latestResponse, setLatestResponse] = useState<string | null>(null);

    const sendMessage = useCallback(
        async (userPrompt: string) => {
            setLoading(true);
            setError(null);
            setLatestResponse(null);

            const trimmedPrompt = userPrompt.trim();
            if (!trimmedPrompt) {
                setError('Prompt cannot be empty.');
                setLoading(false);
                return;
            }

            const userMessage = createMessage('user', trimmedPrompt);
            const systemMessage = createMessage('user', systemPrompt);

            const validatedHistory = [...history, userMessage].filter(
                (item) =>
                    item &&
                    ['user', 'model'].includes(item.role) &&
                    Array.isArray(item.parts) &&
                    item.parts.length > 0 &&
                    typeof item.parts[0].text === 'string' &&
                    item.parts[0].text.trim() !== ''
            );

            const finalHistory = [systemMessage, ...validatedHistory];

            try {
                const res = await axios.post(
                    'https://chatncook-be.onrender.com/api/ai/generate',
                    {
                        prompt: trimmedPrompt,
                        history: finalHistory,
                    }
                );

                const aiResponse = res.data.response;
                const modelMessage = createMessage('model', aiResponse);

                setHistory((prev) => [...prev, userMessage, modelMessage]);
                setLatestResponse(aiResponse);
            } catch (err: any) {
                setError(err?.response?.data?.error || 'Something went wrong.');
            } finally {
                setLoading(false);
            }
        },
        [history]
    );

    return {
        history,
        loading,
        error,
        latestResponse,
        sendMessage,
    };
}
