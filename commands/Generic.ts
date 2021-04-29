import { Command, CommandMessage, Infos } from '@typeit/discord';
import db from '../plugins/firebase';
import { Markov } from '../plugins/markov';
import * as axiosTemp from 'axios';
import { Validate } from '../plugins/tools';
const axios = axiosTemp.default;

export abstract class Say {
  // Get current players from minecraft server
  @Command('mc')
  @Infos({
    command: 'mc',
    detail: '`$mc`',
    description: '* Get the details about Loudness Refugee Minecraft server',
  })
  async getMcStatus(command: CommandMessage): Promise<void> {
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
          '\n\n```diff\nCurrent Players\n\n' +
          activeUsersCount +
          ' Playing\n\n' +
          activePlayers +
          '```';
      } else {
        str += '```diff\n- Server Offline\n```';
      }
      command.channel.send(
        'http://mcapi.us/server/image?ip=blockgame.invertedsilence.com&theme=dark&title=LoudnessRefuge' +
          '&time=' +
          new Date().getTime()
      );
      command.channel.send(str);
    } catch (error) {
      console.log(`[${new Date()}] ERROR`);
      console.log(error);
    }
  }

  // say saus
  @Command('saus')
  @Infos({
    command: `saus`,
    detail: '`$saus`',
    description: '* Gratis Saus',
  })
  async saus(command: CommandMessage): Promise<void> {
    command.channel.send('gratis saus');
  }

  @Command('donate')
  @Infos({
    command: `donate`,
    detail: '`$donate`',
    description: '* Donate to Titancube! https://paypal.me/titancube',
  })
  private async donate(command: CommandMessage): Promise<void> {
    command.channel.send(`
Donate to Titancube for more features! ➡ https://paypal.me/titancube
    `);
  }

  // imitates target person
  @Command('say :tempPerson :tempCount')
  @Infos({
    command: `say`,
    detail: `\`$say <@Mention> <Count?>\``,
    description:
      "* Speaks randomly generated sentence depends on the mentioned person's chat history\n* You can optionally make how much long the message will be with <Count>\n* Note that the length of the message would not exactly match if the maximum length of the message that targeted person has sent before is shorter than the count",
  })
  private async say(command: CommandMessage): Promise<void> {
    const { tempPerson, tempCount } = command.args;
    const person: string = Validate.user(tempPerson)
      ? Validate.userStringParser(tempPerson)
      : Validate.userStringParser(command.author.id);
    const count: number = Validate.checkNumber(tempCount)
      ? parseInt(tempCount + '')
      : 5;

    const tempMessageHolder = [];
    const getHistory = await db
      .collection('Member')
      .doc(person)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .limit(150)
      .get();

    if (!getHistory.empty) {
      getHistory.forEach((r) => {
        tempMessageHolder.push(r.data().message);
      });

      const messagesToLearn: Array<string> = Markov.wordsFilter(
        tempMessageHolder,
        count
      );

      if (messagesToLearn.length < 5) {
        command.channel.send(
          'Need more message histories to generate the message'
        );
        return;
      }

      const markov = new Markov();

      markov.addState(messagesToLearn);
      markov.train();
      command.channel.send(markov.generate(count));
    } else {
      command.channel.send('Invalid user');
    }
  }
}
