import { ArgsOf, Guard, On, Discord } from 'discordx';
import { NotBot } from '../guards/NotBot';
import db from '../plugins/firebase';

@Discord()
export abstract class Remember {
  @On('messageCreate')
  @Guard(NotBot)
  async remember([msg]: ArgsOf<'messageCreate'>): Promise<void> {
    // Cancel saving if the message is a command, empty or is in admin channel
    if (
      msg.content.startsWith('$') ||
      msg.channel.id === '474258213655805972' ||
      msg.content === '' ||
      msg.content.startsWith('http')
    ) {
      return;
    }

    // Save in DB
    try {
      await db
        .collection('Member')
        .doc(msg.author.id)
        .collection('Messages')
        .doc(msg.id)
        .set({
          message: msg.content, // Actual message
          createdAt: msg.createdAt, // When did the message created
        });
    } catch (e) {
      console.log(e);
    }
  }
}
