#!/usr/bin/env node
import { Command } from "commander";
import open from "open";
import { handleAuth, subscribe } from "./auth.js";
import { handleCompletion } from "./suggest.js";
(async () => {
  const program = new Command();

  program
    .name("Shell AI")
    .description(
      "Shell AI is a command line interface to help suggest ways to solve all your problems"
    )
    .version("1.0.1");

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
