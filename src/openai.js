const API_KEY = import.meta.env.VITE_OPENAI_KEY;

export async function sendMsgToOpenAI(message) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "ChatGPT Clone",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await res.json();
    console.log("API Response:", data);

    return data?.choices?.[0]?.message?.content || "No response from AI";
  } catch (err) {
    console.error(err);
    return "Network error — try again";
  }
}
