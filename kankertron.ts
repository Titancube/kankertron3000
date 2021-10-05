/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';
import { Client } from 'discordx';
import { Intents, Message } from 'discord.js';
import * as dotenv from 'dotenv';
import { Logger } from './plugins/tools';
dotenv.config({ path: __dirname + '/.env' });

async function start() {
  const client = new Client({
    prefix: async (message: Message) => {
      return '$';
    },
    classes: [`${__dirname}/commands/*.{js,ts}`],
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
    botGuilds: [process.env.GUILD_ID!],
    silent: true,
  });

  try {
    client.on('ready', async () => {
      Logger.log('Initializing current slash commands...');
      await client.initApplicationCommands();
      Logger.log('...DONE');
      Logger.log('Kankertron is Ready');
    });

    client.on('interactionCreate', (interaction) => {
      client.executeInteraction(interaction);
    });

    client.login(process.env.CLIENT_TOKEN);
  } catch (e) {
    Logger.error('Error');
    console.error(e);
  }
}

start();
