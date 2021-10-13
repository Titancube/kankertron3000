import { Discord, Slash, SlashOption } from 'discordx';
import * as axiosTemp from 'axios';
import { CommandInteraction, GuildMember } from 'discord.js';
import db from '../plugins/firebase';
import { Markov } from '../plugins/markov';
import { Logger } from '../plugins/tools';
// import { randomInt } from 'crypto';
const axios = axiosTemp.default;

@Discord()
export abstract class Generic {
  // Get current players from minecraft server
  @Slash('mc', {
    description: 'Get the details about Loudness Refugee Minecraft Server',
  })
  async getMcStatus(interaction: CommandInteraction): Promise<void> {
    try {
      const res = await axios.get(
        'https://mcapi.us/server/status?ip=blockgame.invertedsilence.com'
      );
      let str =
        '**Loudness Refuge Minecraft Server**\n' +
        '`blockgame.invertedsilence.com`';

      if (await res.data.online) {
        const activeUsers: Promise<Array<Record<string, unknown>>> = await res
          .data.players.sample;
        const activeUsersCount: Promise<number> = await res.data.players.now;
        let activePlayers = '';

        (await activeUsers).forEach((n) => {
          activePlayers += `+ ${n.name}\n`;
        });

        str +=
          '\n\n``diff\nCurrent Players\n\n' +
          activeUsersCount +
          ' Playing\n\n' +
          activePlayers +
          '``';
      } else {
        str += '```diff\n- Server Offline\n```';
      }
      if (interaction.channel) {
        interaction.channel.send(
          'http://mcapi.us/server/image?ip=blockgame.invertedsilence.com&theme=dark&title=Loudness%20Refuge' +
            '&time=' +
            new Date().getTime()
        );
        interaction.reply({ content: str, ephemeral: false });
      }
    } catch (error) {
      console.log(`[${new Date()}] ERROR`);
      console.log(error);
    }
  }

  // say saus
  @Slash('saus', { description: 'Gratis Saus' })
  async saus(interaction: CommandInteraction): Promise<void> {
    interaction.reply({ content: 'gratis saus', ephemeral: false });
  }

  // New imitation function
  @Slash('say', {
    description:
      "Speaks randomly generated sentence depends on the mentioned person's chat history",
  })
  private async say(
    @SlashOption('user', {
      description: 'Target user to imitate',
      type: 'USER',
      required: true,
    })
    user: GuildMember | undefined,
    @SlashOption('length', {
      description: 'How long the output message will be',
      type: 'INTEGER',
      required: true,
    })
    length: number,
    interaction: CommandInteraction
  ): Promise<void> {
    if (length > 100 || length < 5) {
      interaction.reply({
        content:
          'output message length cannot be bigger than 100 nor smaller than 5',
        ephemeral: true,
      });
      return;
    }

    Logger.log(`Imitation log : ${user.id} (${user.displayName}) | ${length}`);
    const tempMessageHolder: string[] = [];
    const getHistory = await db
      .collection('Member')
      .doc(user.id)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .limit(150)
      .get();

    if (!getHistory.empty) {
      getHistory.forEach((r) => {
        tempMessageHolder.push(r.data().message);
      });

      const messagesToLearn: string[] = Markov.wordsFilter(
        tempMessageHolder,
        length
      );

      if (messagesToLearn.length < 5) {
        return interaction.reply('Need more histories to generate the message');
      }

      const markov = new Markov();

      markov.addState(messagesToLearn);
      markov.train();
      interaction.reply(`${user.displayName} says: ${markov.generate(length)}`);
    } else {
      interaction.reply('Invalid user');
    }
  }
}
