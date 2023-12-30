#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import fs, { readFileSync } from "fs";
import open from "open";
import { handleLogin, handleRefreshAuth, signup, subscribe } from "./auth.js";
import { handleCompletion } from "./suggest.js";

(async () => {
  const program = new Command();

  program
    .name("Shell AI")
    .description(
      "Shell AI is a command line interface to help suggest ways to solve all your problems"
    )
    .version("1.3.0");

  program
    .command("suggest")
    .description("Ask a question and get a suggestion")
    .argument("prompt", "What is your question?")
    .option("-c, --copy", "Copy the result to the clipboard", false)
    .action(async (prompt, options) => {
      try {
        if (!fs.existsSync(`${process.env.HOME}/.shellai`)) await handleLogin();
        handleCompletion(prompt, options);
      } catch (error: any) {
        console.log(chalk.bold.redBright(error.message));
      }
    });

  program
    .command("login")
    .description("Login to Shell AI")
    .action(async () => {
      try {
        await handleLogin();
      } catch (error: any) {
        console.log(chalk.bold.redBright(error.message));
      }
    });

  program
    .command("refresh")
    .description("Refresh your login token")
    .action(async () => {
      try {
        const { refresh_token } = JSON.parse(
          readFileSync(`${process.env.HOME}/.shellai`, "ascii")
        );
        await handleRefreshAuth(refresh_token)
      } catch (error: any) {
        console.log(chalk.bold.redBright(error.message));
      }
    });

  program
    .command("subscribe")
    .description("Subscribe to Shell AI")
    .action(async () => {
      try {
        if (!fs.existsSync(`${process.env.HOME}/.shellai`)) await handleLogin();
        await subscribe();
      } catch (error: any) {
        console.log(chalk.red("login failed"));
      }
    });

  program
    .command("signup")
    .description("Signup to Shell AI")
    .action(async () => {
      try {
        await signup();
      } catch (error: any) {
        console.log(chalk.bold.redBright(error.message));
      }
    });

  program
    .command("manage-subscription")
    .description("Manage your subscription")
    .action(async () => {
      try {
        if (!fs.existsSync(`${process.env.HOME}/.shellai`)) await handleLogin();

        console.log(chalk.bold.magenta("Opening your browser..."));

        await open(
          process.env.CUSTOMER_PORTAL ??
            "https://billing.stripe.com/p/login/28o4kb5XicHQ4uc288"
        );
      } catch (error: any) {
        console.log(chalk.bold.redBright(error.message));
      }
    });

  program.parse();
})();
