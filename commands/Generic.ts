import { Discord, Slash } from 'discordx';
import * as axiosTemp from 'axios';
import { CommandInteraction } from 'discord.js';
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

  // TODO - Rewrite the function
  // imitates target person
  // @Slash('say', {description: "Speaks randomly generated sentence depends on the mentioned person's chat history"})
  //   // detail: `\`$say <@Mention> <Count?>\``,
  // private async say(interaction: CommandInteraction): Promise<void> {
  //   const { tempPerson, tempCount } = interaction.args;
  //   const person: string = Validate.user(tempPerson)
  //     ? Validate.userStringParser(tempPerson)
  //     : Validate.userStringParser(interaction.author.id);
  //   const count: number = Validate.checkNumber(tempCount)
  //     ? parseInt(tempCount + '')
  //     : 5;

  //   const tempMessageHolder = [];
  //   const getHistory = await db
  //     .collection('Member')
  //     .doc(person)
  //     .collection('Messages')
  //     .orderBy('createdAt', 'desc')
  //     .limit(150)
  //     .get();

  //   if (!getHistory.empty) {
  //     getHistory.forEach((r) => {
  //       tempMessageHolder.push(r.data().message);
  //     });

  //     const messagesToLearn: Array<string> = Markov.wordsFilter(
  //       tempMessageHolder,
  //       count
  //     );

  //     if (messagesToLearn.length < 5) {
  //       interaction.channel.send(
  //         'Need more message histories to generate the message'
  //       );
  //       return;
  //     }

  //     const markov = new Markov();

  //     markov.addState(messagesToLearn);
  //     markov.train();
  //     interaction.channel.send(markov.generate(count));
  //   } else {
  //     interaction.channel.send('Invalid user');
  //   }
  // }
}
