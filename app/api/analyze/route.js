export async function POST(req) {
    try {
        const { errorLog, context } = await req.json();

        const systemPrompt = `You are an elite software engineer and debugging expert.
Your goal is to analyze the provided error log, stack trace, or buggy code.
Provide a pinpoint accurate, concise explanation of the root cause.
Then, provide the exact code fix.`;

        const userPrompt = `Context/Language: ${context || 'Not specified'}\n\nError/Code:\n${errorLog}`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return Response.json(
                { error: data?.error?.message || "Groq API error" },
                { status: response.status }
            );
        }

        return Response.json(data);

    } catch (err) {
        return Response.json(
            { error: err.message || "Server error" },
            { status: 500 }
        );
    }
}