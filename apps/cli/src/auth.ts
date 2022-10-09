import Axios from "axios";
import chalk from "chalk";
import cliSpinners from "cli-spinners";
import fs, { readFileSync, writeFileSync } from "fs";
import jwt_decode from "jwt-decode";
import logUpdate from "log-update";
import open from "open";
import prompt from "prompt";

const jwt = jwt_decode.default;

const axios = Axios.default;

const { frames, interval } = cliSpinners.dots;
let i = 0;

export const handleLogin = async () => {
  prompt.message = "";

  console.log(
    chalk.bold.blue(
      "\nLogin to your Shell AI account! If you don't have an account, you can create one using the shell-ai signup command \n"
    )
  );
  prompt.start();

  const { email, password } = await prompt.get({
    properties: {
      email: {},
      password: {
        hidden: true,
      },
    } as any,
  });

  const loaderInterval = setInterval(() => {
    logUpdate(
      frames[(i = ++i % frames.length)] +
        chalk.bold.magenta(" Logging you in...")
    );
  }, interval);

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

    clearInterval(loaderInterval);

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
    clearInterval(loaderInterval);
    console.log(chalk.bold.redBright("\nLogin failed 🫣\n"));
    throw error;
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

  const loaderInterval = setInterval(() => {
    logUpdate(
      frames[(i = ++i % frames.length)] +
        chalk.bold.magenta(" Getting you subscribed...")
    );
  }, interval);

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

  clearInterval(loaderInterval);

  console.log(
    chalk.bold.magentaBright(
      "\nTaking you to the subscription page now. Once you have completed the subscription, make sure to run shell-ai login again to get your new access token 🥳\n"
    )
  );

  open(response.data.paymentLinkUrl);
};

export const signup = async () => {
  prompt.message = "";

  console.log(chalk.bold.blue("\nCreate your account below \n"));
  prompt.start();

  const { email, password } = await prompt.get({
    properties: {
      email: {},
      password: {
        hidden: true,
      },
    } as any,
  });

  const loaderInterval = setInterval(() => {
    logUpdate(
      frames[(i = ++i % frames.length)] +
        chalk.bold.magenta(" Signing you up...")
    );
  }, interval);

  try {
    await axios.request({
      url:
        process.env.SIGNUP_URL ??
        ("https://shell-ai-api.vercel.app/api/signup" as string),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify({
        email,
        password,
      }),
    });

    clearInterval(loaderInterval);

    console.log(
      chalk.bold.greenBright(
        "\nSuccessfully signed up 🥳 - Run shell-ai subscribe to get yourself a premium subscription and you are good to go!\n"
      )
    );
  } catch (error) {
    clearInterval(loaderInterval);
    throw new Error("Signup failed 🫣");
  }
};
