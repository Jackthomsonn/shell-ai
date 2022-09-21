#!/usr/bin/env node
import { Command } from "commander";
import { CreateCompletionResponseChoicesInner } from "openai";
import chalk from "chalk";
import clipboard from "clipboardy";
import fetch from "node-fetch";

const generateRainbowText = () => {
  const rainbowText = [
    "\n",
    chalk.bold.greenBright("S"),
    chalk.bold.redBright("u"),
    chalk.bold.yellowBright("g"),
    chalk.bold.blueBright("g"),
    chalk.bold.yellowBright("e"),
    chalk.bold.blueBright("s"),
    chalk.bold.magentaBright("t"),
    chalk.bold.cyanBright("e"),
    chalk.bold.greenBright("d"),
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
    console.log(chalk.bold.magentaBright("Answer copied to clipboard"));
  }
};

const handleCompletion = async (prompt: string, options: any) => {
  const result = await fetch(
    process.env.URL ?? ("https://shell-ai-api.vercel.app/api" as string),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }
  );

  const choices =
    (await result.json()) as CreateCompletionResponseChoicesInner[];

  if (choices?.length) {
    choices.forEach((choice: CreateCompletionResponseChoicesInner) => {
      if (choice && choice.text) {
        console.log(
          generateRainbowText(),
          `\n${chalk.bold.blueBright("--------------------")}\n`,
          chalk.bold.whiteBright(choice.text.trim()),
          `\n${chalk.bold.blueBright("--------------------")}\n`
        );

        if (options.copy) {
          copyToClipboard(choice);
        }
      }
    });
  }
};

(async () => {
  const program = new Command();

  program
    .name("Shell AI")
    .description(
      "Shell AI is a command line interface to help suggest ways to solve all your problems"
    )
    .version("0.0.1");

  program
    .command("suggest")
    .description("Ask a question and get a suggestion")
    .argument("prompt", "What is your question?")
    .option("-c, --copy", "Copy the result to the clipboard", false)
    .action(handleCompletion);

  program.parse();
})();
