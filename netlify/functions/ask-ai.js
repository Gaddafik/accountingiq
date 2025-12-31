import fetch from "node-fetch";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { question } = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 200
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Sorry, I could not generate an answer.";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: "Error connecting to AI." })
    };
  }
}
