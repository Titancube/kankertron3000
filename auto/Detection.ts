import { ArgsOf, Guard, On } from "@typeit/discord";
import { NotBot } from "../guards/NotBot";

export abstract class Detection {
  @On("message")
  @Guard(NotBot)
  private async textWithoutInfo([msg]: ArgsOf<"message">): Promise<void> {
    // Check the channel - set to #resources-n-sales / "827736673777090620"
    if (
      msg.channel.id !== "827736673777090620" ||
      msg.member.hasPermission("ADMINISTRATOR", { checkAdmin: true })
    ) {
      return;
    }

    // Cancel detection if the message is written by mods
    Detection.hasLink([msg]) || Detection.hasAttachment([msg])
      ? // Message has a link or attachment
        true
      : // Message does not have a link or an attachment. Delete the message
        (msg.delete(),
        await msg.author.send(
          "Messages on the `#resources-n-sales` should have at least one attachment or link!\nIf this problem keeps occuring please contact **blob(Titancube)** on the server."
        ));
  }

  // Detect if the message has link
  private static hasLink([msg]: ArgsOf<"message">) {
    return msg.content.search(Detection.urlRegex) > -1 ? true : false;
  }

  // Detect if the message has attachment
  private static hasAttachment([msg]: ArgsOf<"message">) {
    return msg.attachments.size > 0 ? true : false;
  }

  // Regex for link detection
  static urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
}
