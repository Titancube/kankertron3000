import { Command, CommandMessage, Infos } from "@typeit/discord";

export abstract class Leave {
  @Command("leave")
  @Infos({
    command: `leave`,
    detail: "`$leave`",
    description: "* leaves voice channel",
  })
  private async leave(command: CommandMessage): Promise<void> {
    const vc = command.member.voice.channel;
    if (vc) {
      command.guild.me.voice.channel.leave();
    } else {
      return;
    }
  }
}
