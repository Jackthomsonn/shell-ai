import Axios from "axios";
import chalk from "chalk";
import { writeFileSync } from "fs";
import prompt from "prompt";

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
      url: "http://localhost:3000/api/auth",
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

    writeFileSync(
      `${process.env.HOME}/.shellai`,
      JSON.stringify(toStore, null, 2)
    );

    console.log(chalk.bold.greenBright("\nLogged in 🥳\n"));
  } catch (error) {
    console.log(chalk.bold.redBright("\nLogin failed 🫣\n"));
  }
};

export const handleRefreshAuth = async (refresh_token: string) => {
  const response = await axios.request({
    method: "POST",
    url: "http://localhost:3000/api/refresh",
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
