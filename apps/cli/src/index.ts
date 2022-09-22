#!/usr/bin/env node
import { Command } from "commander";
import { handleAuth } from "./auth.js";
import { handleCompletion } from "./suggest.js";

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

  program.command("auth").description("Login to Shell AI").action(handleAuth);

  program.parse();
})();
