import chalk from "chalk";
import clipboard from "clipboardy";
import { readFileSync } from "fs";
import jwt_decode from "jwt-decode";
import moment from "moment";
import fetch from "node-fetch";
import { CreateCompletionResponseChoicesInner } from "openai";
import { handleRefreshAuth } from "./auth.js";

const jwt = jwt_decode.default;

const generateRainbowText = () => {
  const rainbowText = [
    chalk.bold.greenBright("S"),
    chalk.bold.redBright("u"),
    chalk.bold.yellowBright("g"),
    chalk.bold.blueBright("g"),
    chalk.bold.yellowBright("e"),
    chalk.bold.blueBright("s"),
    chalk.bold.magentaBright("t"),
    chalk.bold.cyanBright("e"),
    chalk.bold.greenBright("d"),
    "",
    chalk.bold.blueBright(" a"),
    chalk.bold.redBright("n"),
    chalk.bold.yellowBright("s"),
    chalk.bold.blueBright("w"),
    chalk.bold.magentaBright("e"),
    chalk.bold.cyanBright("r"),
  ];

  return rainbowText.join(" ");
};

const copyToClipboard = (choice: CreateCompletionResponseChoicesInner) => {
  if (choice && choice.text) {
    clipboard.writeSync(choice.text.trim());
    console.log(chalk.bold.magentaBright("\nAnswer copied to clipboard 🥳\n"));
  }
};

const run = async (options: any, access_token: string, prompt: string) => {
  try {
    const result = await fetch(
      process.env.URL ?? ("https://shell-ai-api.vercel.app/suggest" as string),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (result.status === 401 || result.status === 403) {
      console.log(
        chalk.bold.redBright(
          "\nUnauthorized, please make sure you are logged in and have an active subscription 🤯\n"
        )
      );
      return;
    }

    const choices =
      (await result.json()) as CreateCompletionResponseChoicesInner[];

    if (choices?.length) {
      choices.forEach((choice: CreateCompletionResponseChoicesInner) => {
        if (choice && choice.text) {
          console.log(
            `\n${generateRainbowText()} 🎉`,
            `\n${chalk.bold.greenBright("--------------------")}\n\n`,
            chalk.bold.whiteBright(choice.text.trim()),
            `\n\n${chalk.bold.greenBright("--------------------")}\n`
          );

          if (options.copy) {
            copyToClipboard(choice);
          }
        }
      });
    }
  } catch (error) {
    console.log(chalk.bold.redBright("\nSomething went wrong 🫣\n"));
  }
};

export const handleCompletion = async (prompt: string, options: any) => {
  try {
    const { access_token, refresh_token } = JSON.parse(
      readFileSync(`${process.env.HOME}/.shellai`, "ascii")
    );

    const decoded: { exp: number } = jwt(access_token);

    if (moment(decoded.exp).isAfter(moment())) {
      const { access_token: new_access_token } = await handleRefreshAuth(
        refresh_token
      );

      await run(options, new_access_token, prompt);
    } else {
      await run(options, access_token, prompt);
    }
  } catch (error) {
    console.log(chalk.bold.redBright("\You need to be logged in 🫣 - run shell-ai auth\n"));
  }
};
