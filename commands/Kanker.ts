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

    const getRndBias = (
      min: number,
      max: number,
      bias: number,
      influence: number
    ) => {
      const rnd = Math.random() * (max - min) + min, // random in range
        mix = Math.random() * influence; // random mixer
      return rnd * (1 - mix) + bias * mix; // mix full range and bias
    };

    const theTime = getRndBias(1000, 120000, 2000, 0.75);

    if (vc) {
      const r = await vc.join();
      const play = async () => {
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
      };
      setTimeout(play, theTime);
    } else {
      command.channel.send(
        "Join voice channel to execute this horrifying function"
      );
    }
  }
}
