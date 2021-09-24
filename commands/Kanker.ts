import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  createAudioPlayer,
} from "@discordjs/voice";
import {
  Client,
  Description,
  Discord,
  Guard,
  Permission,
  Slash,
} from "@typeit/discord";
import { CommandInteraction } from "discord.js";
import * as path from "path";
import { IsAdmin } from "../guards/IsAdmin";

@Discord()
export abstract class Kanker {
  private static async voiceEmitter(
    interaction: CommandInteraction,
    client: Client,
    file: string,
    volume: number
  ) {
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    const vc = member.voice.channel;

    const conn = joinVoiceChannel({
      guildId: vc.guildId,
      channelId: vc.id,
      adapterCreator: vc.guild.voiceAdapterCreator,
    });

    conn.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
      console.log(`VC Connected | Channel: ${vc.name}`);
    });

    // const vc = command.member.voice.channel;
    // if (vc) {
    //   const r = await vc.join();
    //   const dispatcher = r.play(
    //     path.join(__dirname, `../assets/audio/${file}`)
    //   );

    //   dispatcher.setVolume(volume);

    //   dispatcher
    //     .on("finish", () => {
    //       dispatcher.destroy();
    //       interaction.guild.me.voice.channel.leave();
    //     })
    //     .on("error", (e) => {
    //       console.log(`
    //       ${e.name}

    //       ${e.message}

    //       ${e.stack}
    //       `);
    //     });
    // } else {
    //   command.channel.send("Join voice channel to execute the function");
    // }
  }

  @Slash("kanker")
  @Description("Kanker")
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

  // admin only: instant kanker
  @Permission("422067493578997760", "ROLE")
  @Slash("tactkank")
  @Description("Kanker but instant, Admin only")
  private async tactkank(command: CommandMessage): Promise<void> {
    Kanker.voiceEmitter(command, "kanker.wav", 0.65);
  }

  // leaves voice channel
  @Slash("leave")
  @Description("Leaves voice channel")
  private async leave(
    interaction: CommandInteraction,
    client: Client
  ): Promise<void> {
    // command.member.voice.channel ? command.member.voice.channel.leave() : false;
    interaction;
  }
}
