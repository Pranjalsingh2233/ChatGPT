require("dotenv").config();

module.exports.getOpenAIApiRes = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };
  try {
    const res = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const response = await res.json();
    return response.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
};
