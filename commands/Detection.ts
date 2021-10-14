import { ArgsOf, Discord, Guard, On } from 'discordx';
import { NotBot } from '../guards/NotBot';

@Discord() // Temporary disable
export abstract class Detection {
  @On('messageCreate')
  @Guard(NotBot) // Message author should not be the bot
  private async textWithoutInfo([msg]: ArgsOf<'messageCreate'>): Promise<void> {
    // Check the channel - set to #resources-n-sales / "827736673777090620"
    // Check if the message author has admin permission
    // Stop if at least one of both is true
    if (
      msg.channel.id !== '827736673777090620' ||
      msg.member.permissions.has('ADMINISTRATOR', true)
    ) {
      return;
    }

    // Check if the message has at least one link or attachment
    Detection.hasLink([msg]) || Detection.hasAttachment([msg])
      ? // Message has a link or attachment, pass the message
        true
      : // Message does not have a link or an attachment. Delete the message and send notification through DM
        (msg.delete(),
        await msg.author.send(
          'Messages on the `#resources-n-sales` should have at least one attachment or link!\nIf this problem keeps occuring please contact **blob(Titancube)** on the server.'
        ));
  }

  // Detect if the message has link
  private static hasLink([msg]: ArgsOf<'messageCreate'>) {
    // Return true if index of detected url is bigger than -1. String.prototype.search() returns -1 when it finds nothing
    return msg.content.search(Detection.urlRegex) > -1 ? true : false;
  }

  // Detect if the message has attachment
  private static hasAttachment([msg]: ArgsOf<'messageCreate'>) {
    // Return true if attachment count is bigger than 0
    return msg.attachments.size > 0 ? true : false;
  }

  // Regex for link detection
  static urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
}
