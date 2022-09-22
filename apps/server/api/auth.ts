import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { email, password } = req.body;

  try {
    axios
      .request({
        method: "POST",
        url: "https://shell-ai.eu.auth0.com/oauth/token",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: new URLSearchParams({
          grant_type: "password",
          username: email,
          password: password,
          audience: "https://shell-ai-api.vercel.app",
          client_id: process.env.CLIENT_ID as string,
          scope: "offline_access",
          client_secret: process.env.CLIENT_SECRET as string,
        }),
      })
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  } catch (error: any) {
    console.debug("Completion request failed", { reason: error.message });

    res.status(500).json(JSON.stringify({ error }));
  }
};
