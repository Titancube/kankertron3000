import "reflect-metadata";
import { Intents, Interaction } from "discord.js";
import { Client } from "@typeit/discord";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "./.env") });

const start = async () => {
  const _client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    classes: [`${__dirname}/commands/*.ts`, `${__dirname}/commands/*.js`],
    silent: false,
  });

  _client.once("ready", async () => {
    await _client.initSlashes();
  });

  _client.on("interaction", (interaction) => {
    _client.executeSlash(interaction);
  });

  await _client.login(process.env.CLIENT_TOKEN!);
};

start();
