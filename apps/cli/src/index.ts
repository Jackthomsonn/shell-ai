#!/usr/bin/env node
import { Command } from "commander";
import open from "open";
import { handleAuth, subscribe } from "./auth.js";
import { handleCompletion } from "./suggest.js";
import fs from "fs";

(async () => {
  const program = new Command();

  // Check if files exists otherwise create it filesystem
  if (!fs.existsSync(`${process.env.HOME}/.shellai`)) {
    // Execute shell-ai auth command
    await handleAuth();
  }

  program
    .name("Shell AI")
    .description(
      "Shell AI is a command line interface to help suggest ways to solve all your problems"
    )
    .version("1.2.0");

  program
    .command("suggest")
    .description("Ask a question and get a suggestion")
    .argument("prompt", "What is your question?")
    .option("-c, --copy", "Copy the result to the clipboard", false)
    .action(handleCompletion);

  program.command("auth").description("Login to Shell AI").action(handleAuth);
  program
    .command("subscribe")
    .description("Subscribe to Shell AI")
    .action(subscribe);

  program
    .command("manage-subscription")
    .description("Manage your subscription")
    .action(async () => {
      await open("https://billing.stripe.com/p/login/test_dR63fI3o7b7d39S7ss");
    });

  program.parse();
})();
