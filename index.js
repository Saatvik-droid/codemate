#! /usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";
import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const getPalmResponse = async (data) => {
  const MODEL_NAME = "models/chat-bison-001";
  const API_KEY = process.env.API_KEY;

  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  const prompt = `Explain the content of the following file in a concise manner:
  ${data}
  `;
  let result = null;
  console.log(chalk.yellow("Fetching from PaLM API..."));
  do {
    result = await client.generateMessage({
      model: MODEL_NAME,
      temperature: 0.5,
      candidateCount: 1,
      prompt: {
        messages: [{ content: prompt }],
      },
    });
  } while (
    !result ||
    !result[0] ||
    !result[0].candidates ||
    !result[0].candidates[0] ||
    !result[0].candidates[0].content
  );
  return result[0].candidates[0].content;
};

const explain = async (file) => {
  const filePath = path.resolve(process.cwd(), file);
  try {
    const data = await fs.readFile(filePath, "utf8");
    const res = await getPalmResponse(data);
    console.log(`${chalk.yellow("Response:")}\n${chalk.white(res)}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(chalk.redBright(`File not found at ${filePath}`));
    } else {
      console.log(chalk.redBright(`Error reading the file: ${err}`));
    }
  }
};

program
  .command("explain <file>")
  .description("Explains code in current file")
  .action(explain);

program.parse();

