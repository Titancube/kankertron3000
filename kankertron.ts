/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';
import { Intents } from 'discord.js';
import { Client } from '@typeit/discord';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, './.env') });

const start = async () => {
  const _client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_WEBHOOKS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_INVITES,
      Intents.FLAGS.GUILD_BANS,
    ],
    slashGuilds: ['421792855506419714'],
    // classes: [`${__dirname}/commands/*.ts`, `${__dirname}/commands/*.js`],
    classes: [`${__dirname}/commands/Kanker.ts`],
    silent: false,
  });

  _client.once('ready', async () => {
    await _client.initSlashes();
  });

  _client.on('interactionCreate', (interaction) => {
    _client.executeSlash(interaction);
  });

  await _client.login(process.env.CLIENT_TOKEN!);
};

start();
