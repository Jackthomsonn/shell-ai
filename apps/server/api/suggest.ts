import { Configuration, OpenAIApi } from "openai";
import { VercelRequest, VercelResponse } from "@vercel/node";
import jwt_decode from "jwt-decode";

const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.PUBLIC_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req: VercelRequest, res: VercelResponse) => {
  // const token = req?.headers?.authorization as string;

  // const { sub }: { sub: string } = jwt_decode(token);

  // if (!token) {
  //   res.status(401).json({ error: "Unauthorized" });
  //   return;
  // }

  // Perform a check i n the DB for the users id and check they have an active subscription
  // if (sub !== "auth0|632cc6eadd582fd2b46b5f08") {
  //   res.status(403).send({ error: "Forbidden" });
  //   return;
  // }

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
