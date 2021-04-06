import { Command, CommandMessage, Guard, Infos } from "@typeit/discord";
import * as path from "path";
import { isAdmin } from "../guards/isAdmin";

export abstract class Kanker {
  private static async voiceEmitter(
    command: CommandMessage,
    file: string,
    volume: number
  ) {
    const vc = command.member.voice.channel;
    if (vc) {
      const r = await vc.join();
      const dispatcher = r.play(
        path.join(__dirname, `../assets/audio/${file}`)
      );

      dispatcher.setVolume(volume);

      dispatcher
        .on("finish", () => {
          dispatcher.destroy();
          command.guild.me.voice.channel.leave();
        })
        .on("error", (e) => {
          console.log(`
          ${e.name}

          ${e.message}

          ${e.stack}
          `);
        });
    } else {
      command.channel.send("Join voice channel to execute the function");
    }
  }

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
            command.member.voice.channel.leave();
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

  @Command("tactkank")
  @Guard(isAdmin)
  @Infos({
    command: `tactkank`,
    detail: "`$tactkank`",
    description: "* Kanker but instant, Admin only",
  })
  private async tactkank(command: CommandMessage): Promise<void> {
    Kanker.voiceEmitter(command, "kanker.wav", 0.65);
  }

  @Command("leave")
  @Infos({
    command: `leave`,
    detail: "`$leave`",
    description: "* leaves voice channel",
  })
  private async leave(command: CommandMessage): Promise<void> {
    const vc = () => (command.member.voice.channel ? true : false);
    if (vc) {
      command.member.voice.channel.leave();
    } else {
      return;
    }
  }
}
