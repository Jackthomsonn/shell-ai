import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async (req: VercelRequest, res: VercelResponse) => {
  console.log('Refreshing token');

  const { refresh_token } = req.body;

  try {
    axios
      .request({
        method: 'POST',
        url: 'https://shell-ai.eu.auth0.com/oauth/token',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: process.env.CLIENT_ID as string,
          client_secret: process.env.CLIENT_SECRET as string,
          refresh_token: refresh_token
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
