import { Command, CommandMessage, Infos } from "@typeit/discord";
import * as path from "path";

export abstract class Kanker {
  @Command("kanker")
  @Infos({
    command: `kanker`,
    detail: "`$kanker`",
    description: "* kanker",
  })
  private async kanker(command: CommandMessage): Promise<void> {
    const vc = command.member.voice.channel;
    if (vc) {
      const r = await vc.join();
      const dispatcher = r.play(
        path.join(__dirname, "../assets/audio/kanker.wav")
      );

      dispatcher.setVolume(0.75);

      dispatcher
        .on("finish", () => {
          console.log("DONE");
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
