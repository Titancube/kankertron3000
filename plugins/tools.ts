import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus,
} from '@discordjs/voice';
import { join } from 'path';
import { format } from 'date-fns';
import { CommandInteraction } from 'discord.js';
import { Client } from 'discordx';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

export class Misc {
  static get currentTime(): string {
    return format(new Date(), 'MM-dd HH:mm:ss.SSS');
  }
}

export class Logger {
  static error(str: string): void {
    console.error(`${Misc.currentTime} | <<!>> ${str}`);
  }
  static log(str: string): void {
    console.log(`${Misc.currentTime} | ${str}`);
  }
}

// export class Validate {
//   /**
//    * Check if `id` is valid.
//    * Also trims `<!@...> or <@...>`
//    * @param id
//    * @returns `boolean`
//    */
//   static user(id: string): boolean {
//     const validate = new RegExp(/([0-9])+/g);
//     return id && validate.exec(id)[0] ? true : false;
//   }

//   /**
//    * Trims discord mention's head & tail i.e `<!@...>`
//    * @param user discord mention
//    * @returns parsed by regex
//    */
//   static userStringParser(user: string): string {
//     const validate = new RegExp(/([0-9])+/g);
//     return validate.exec(user)[0];
//   }

//   /**
//    * Check user and return the parsed data
//    * @param id Discord user id
//    * @returns Parsed user id or ''
//    */
//   static userValidateAndParse(id: string): string {
//     return this.user(id) ? this.userStringParser(id) : '';
//   }

//   /**
//    * Check if the property can be parsed into number and returns it
//    * @param num unknown
//    * @returns Parsed number if the `num` could be parsed
//    */
//   static checkNumber(num: unknown): boolean {
//     try {
//       return typeof num == 'number' ? true : false;
//     } catch (e) {
//       console.error(`[${new Date()}] ${e}`);
//     }
//   }
// }

export class VoiceFunctions {
  static async voiceEmitter(
    interaction: CommandInteraction,
    client: Client,
    file: string,
    volume: number
  ): Promise<void> {
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    const vc = member.voice.channel;
    if (vc) {
      const conn = joinVoiceChannel({
        guildId: vc.guildId,
        channelId: vc.id,
        adapterCreator: vc.guild.voiceAdapterCreator,
      });

      conn.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
        Logger.log(`VC Connected | Channel: ${vc.name}`);
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
        });
        const r = createAudioResource(
          join(__dirname, `../assets/audio/${file}`),
          { inlineVolume: true }
        );
        Logger.log(
          `Playing Audio : ${join(__dirname, `../assets/audio/${file}`)}`
        );
        r.volume.setVolume(volume);

        conn.subscribe(player);
        player.play(r);

        player.on(AudioPlayerStatus.Idle, () => {
          player.stop();
          conn.disconnect();
          conn.destroy();
        });

        player.on('error', (error) => {
          console.error(`Error: ${error.message}`);
          player.stop();
          conn.disconnect();
          conn.destroy();
        });

        player.on('stateChange', (oldState, newState) => {
          Logger.log(
            `AP Status | State Transition : ${oldState.status} => ${newState.status}`
          );
        });
      });

      conn.on('stateChange', (oldState, newState) => {
        Logger.log(
          `VC Status | State Transition : ${oldState.status} => ${newState.status}`
        );
      });
    } else {
      interaction.reply('Join VC to play audio');
    }
  }
}
