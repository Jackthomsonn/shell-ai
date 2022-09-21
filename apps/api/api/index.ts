import { Configuration, OpenAIApi } from "openai";
import { VercelRequest, VercelResponse } from "@vercel/node";

const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.PUBLIC_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req: VercelRequest, res: VercelResponse) => {
  console.debug("Request started");

  const prompt = req.body.prompt;

  try {
    console.debug("Starting completion request", { prompt });

    const result = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: [prompt],
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
    });

    console.debug("Completion request successful", {
      numberOfChoices: result.data.choices?.length,
    });

    res.status(200).json(result.data.choices);
  } catch (error: any) {
    console.debug("Completion request failed", { reason: error.message });

    res.status(500).json(JSON.stringify({ error }));
  }
};
