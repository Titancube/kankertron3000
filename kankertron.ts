/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';
import { Client } from 'discordx';
import { Intents, Message } from 'discord.js';
import * as dotenv from 'dotenv';
import { Logger } from './plugins/tools';
import { format } from 'date-fns';
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
      Logger.writeLog(
        `\r\n${'-'.repeat(10)} K A N K E R T R O N    3 0 0 0 ${'-'.repeat(
          10
        )}`,
        true
      );
      Logger.writeLog(
        `Booted at ${format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSS')}\r\n`,
        true
      );
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
    Logger.log('Exception', true);
    console.error(e);
  }
}

start();
