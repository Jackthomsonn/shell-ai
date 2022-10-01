import { VercelRequest, VercelResponse } from "@vercel/node";
import { ManagementClient } from "auth0";

const auth0 = new ManagementClient({
  domain: "shell-ai.eu.auth0.com",
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { email, password } = req.body;

    await auth0.createUser({
      email,
      password,
      connection: "Username-Password-Authentication",
    });

    res.status(200).json({ message: "User created" });
  } catch (err) {
    return res.status(400).send(`Error: ${err.message}`);
  }
};
