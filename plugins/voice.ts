import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus,
  DiscordGatewayAdapterCreator,
} from '@discordjs/voice';
import { join } from 'path';
import { CommandInteraction } from 'discord.js';
import { Client } from 'discordx';
import { Logger } from './tools';

export class VoiceFunctions {
  static async voiceEmitter(
    interaction: CommandInteraction,
    client: Client,
    file: string,
    volume: number,
    msg: string
  ): Promise<void> {
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    const vc = member.voice.channel;
    if (vc) {
      try {
        const conn = joinVoiceChannel({
          guildId: vc.guildId,
          channelId: vc.id,
          adapterCreator: vc.guild
            .voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
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
          r.volume.setVolume(volume);

          conn.subscribe(player);
          player.play(r);
          Logger.log(
            `Playing Audio : ${join(__dirname, `../assets/audio/${file}`)}`
          );

          player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            conn.disconnect();
            conn.destroy();
          });

          player.on('error', (error) => {
            Logger.log(`Error: ${error.message}`, true);
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

        interaction.reply({
          content: msg,
          ephemeral: true,
        });
      } catch (e) {
        Logger.log('Exception Error', true);
        console.error(e);
      }
    } else {
      interaction.reply({
        content: 'Join VC to play audio',
        ephemeral: true,
      });
    }
  }
}
