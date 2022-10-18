import chalk from "chalk";
import cliSpinners from "cli-spinners";
import clipboard from "clipboardy";
import { readFileSync } from "fs";
import jwt_decode from "jwt-decode";
import logUpdate from "log-update";
import moment from "moment";
import fetch from "node-fetch";
import { CreateCompletionResponseChoicesInner } from "openai";
import { handleRefreshAuth } from "./auth.js";

const jwt = jwt_decode.default;

const { frames, interval } = cliSpinners.dots;
let i = 0;

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
    const loaderInterval = setInterval(() => {
      logUpdate(
        frames[(i = ++i % frames.length)] +
          chalk.bold.magenta(" Working on a suggestion for you...")
      );
    }, interval);

    const result = await fetch(
      process.env.SUGGEST_URL ??
        ("https://shell-ai-api.vercel.app/api/suggest" as string),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ prompt }),
      }
    );

    clearInterval(loaderInterval);

    if (result.status === 429) {
      console.log(
        chalk.bold.redBright(
          "You have made too many requests. Please try again in a bit"
        )
      );
      return;
    }

    if (result.status === 400) {
      console.log(
        chalk.bold.redBright(
          "Your request was malformed. Please check your prompt and try again"
        )
      );
      return;
    }

    if (result.status === 401 || result.status === 403) {
      console.log(
        chalk.bold.redBright(
          "\nIt looks like you don't have an active subscription 🤯 - You can get one by running shell-ai subscribe\n"
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
            `\n${generateRainbowText()} (Note: Output is AI-generated and may contain inaccuracies) 🎉`,
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
  } catch (error: any) {
    throw new Error(error);
  }
};

export const handleCompletion = async (prompt: string, options: any) => {
  try {
    const { access_token, refresh_token } = JSON.parse(
      readFileSync(`${process.env.HOME}/.shellai`, "ascii")
    );

    const decoded: { exp: number; permissions: string[] } = jwt(access_token);

    if (moment(decoded.exp * 1000).isSameOrBefore(moment())) {
      const { access_token: new_access_token } = await handleRefreshAuth(
        refresh_token
      );

      const decoded: { exp: number; permissions: string[] } = jwt(access_token);

      if (!decoded.permissions.includes("shell:premium")) {
        throw new Error(
          "It looks like you don't have an active subscription 🤯 - You can get one by running shell-ai subscribe. If you have already done this, make sure to run shell-ai login again to refresh your account"
        );
      }

      await run(options, new_access_token, prompt);
    } else {
      if (!decoded.permissions.includes("shell:premium")) {
        throw new Error(
          "It looks like you don't have an active subscription 🤯 - You can get one by running shell-ai subscribe. If you have already done this, make sure to run shell-ai login again to refresh your account"
        );
      }

      await run(options, access_token, prompt);
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
