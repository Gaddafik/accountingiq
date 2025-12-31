import fetch from "node-fetch";

export async function handler(event) {
  const { question } = JSON.parse(event.body);
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 200
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Sorry, no answer.";

    return { statusCode: 200, body: JSON.stringify({ answer }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ answer: "Error connecting to AI." }) };
  }
  }
