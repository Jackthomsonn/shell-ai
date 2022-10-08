import { Configuration, OpenAIApi } from "openai";
import { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jwt-decode";
import lambda from "lambda-rate-limiter";

const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.PUBLIC_KEY,
});

const { check } = lambda({
  interval: 60 * 1000,
});

const openai = new OpenAIApi(configuration);

export default async (req: VercelRequest, res: VercelResponse) => {
  const prompt = req.body.prompt;
  const token = req.headers.authorization as string;

  try {
    console.log("check", { token });
    await check(10, token);
    console.log("passed");
  } catch (e) {
    return res.status(429).json("Too many requests");
  }

  const decoded: { exp: number; permissions: string[] } = jwt(
    token.split(" ").pop() as string
  );

  console.log(decoded.permissions);

  if (!decoded.permissions.includes("shell:premium"))
    return res.status(403).json("Forbidden");

  try {
    console.debug(
      "Starting completion request",
      JSON.stringify({ prompt }, null, 2)
    );

    const result = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: [prompt],
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
    });

    console.debug(
      "Completion request successful",
      JSON.stringify(
        {
          numberOfChoices: result.data.choices?.length,
        },
        null,
        2
      )
    );

    res.status(200).json(result.data.choices);
  } catch (error: any) {
    console.debug(
      "Completion request failed",
      JSON.stringify({ reason: error.message }, null, 2)
    );

    res.status(500).json(JSON.stringify({ error }));
  }
};
