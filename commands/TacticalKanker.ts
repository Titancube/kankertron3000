import { Command, CommandMessage, Guard, Infos } from "@typeit/discord";
import * as path from "path";
import { isAdmin } from "../guards/isAdmin";

export abstract class TacticalKanker {
  @Command("kanker")
  @Guard(isAdmin)
  @Infos({
    command: `tackank`,
    detail: "`$tackank`",
    description: "* Kanker but instant, Admin only",
  })
  private async tackank(command: CommandMessage): Promise<void> {
    const vc = command.member.voice.channel;

    if (vc) {
      const r = await vc.join();
      const dispatcher = r.play(
        path.join(__dirname, "../assets/audio/kanker.wav")
      );
      dispatcher.setVolume(0.65);
      dispatcher
        .on("finish", () => {
          dispatcher.destroy();
          command.guild.me.voice.channel.leave();
        })
        .on("error", (e) => {
          console.log(e);
        });
    } else {
      command.channel.send(
        "Join voice channel to execute this horrifying function"
      );
    }
  }
}
