import Axios from "axios";
import chalk from "chalk";
import { readFileSync, writeFileSync } from "fs";
import jwt_decode from "jwt-decode";
import open from "open";
import prompt from "prompt";
import fs from 'fs';

const jwt = jwt_decode.default;

const axios = Axios.default;

export const handleAuth = async () => {
  prompt.message = "";

  console.log(
    chalk.bold.blue(
      "\nLogin to your Shell AI account! If you don't have an account, you can create one at https://shell.ai \n"
    )
  );
  prompt.start();

  const { email, password } = await prompt.get<{
    email: string;
    password: string;
  }>(["email", "password"]);

  try {
    const response = await axios.request({
      url:
        process.env.AUTH_URL ??
        ("https://shell-ai-api.vercel.app/api/auth" as string),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify({
        email,
        password,
      }),
    });

    const toStore = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };

    if (!fs.existsSync(`${process.env.HOME}/.shellai/`)) {
      writeFileSync(
        `${process.env.HOME}/.shellai`,
        JSON.stringify(toStore, null, 2)
      );
    } else {
      writeFileSync(
        `${process.env.HOME}/.shellai`,
        JSON.stringify(toStore, null, 2)
      );
    }

    console.log(chalk.bold.greenBright("\nLogged in 🥳\n"));
  } catch (error) {
    console.log(chalk.bold.redBright("\nLogin failed 🫣\n"));
  }
};

export const handleRefreshAuth = async (refresh_token: string) => {
  const response = await axios.request({
    method: "POST",
    url:
      process.env.REFRESH_URL ??
      ("https://shell-ai-api.vercel.app/api/refresh" as string),
    headers: { "content-type": "application/json" },
    data: JSON.stringify({
      refresh_token: refresh_token,
    }),
  });

  const toStore = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };

  writeFileSync(
    `${process.env.HOME}/.shellai`,
    JSON.stringify(toStore, null, 2)
  );

  return response.data;
};

export const subscribe = async () => {
  const { access_token } = JSON.parse(
    readFileSync(`${process.env.HOME}/.shellai`, "ascii")
  );

  const { sub }: { sub: string } = jwt(access_token);

  const response = await axios.request({
    method: "POST",
    url:
      process.env.SUBSCRIBE_URL ??
      ("https://shell-ai-api.vercel.app/api/subscribe" as string),
    headers: { "content-type": "application/json" },
    data: JSON.stringify({
      user_id: sub,
    }),
  });

  console.log(
    chalk.bold.magentaBright(
      "\nTaking you to the subscription page now. Once you have completed the subscription, make sure to run shell-ai auth again to get your new access token 🥳\n"
    )
  );

  open(response.data.paymentLinkUrl);
};
