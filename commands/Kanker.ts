import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  DiscordGatewayAdapterCreator,
} from '@discordjs/voice';
import { Client, Discord, Permission, Slash } from 'discordx';
import { CommandInteraction } from 'discord.js';
import { Logger } from '../plugins/tools';
import { VoiceFunctions } from '../plugins/voice';
import { join } from 'path';

@Discord()
export abstract class Kanker {
  @Slash('kanker', { description: 'Kanker' })
  private async kanker(
    interaction: CommandInteraction,
    client: Client
  ): Promise<void> {
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    const vc = member.voice.channel;

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
      interaction.reply({ content: 'Executing Kanker', ephemeral: true });
      try {
        const conn = joinVoiceChannel({
          guildId: vc.guildId,
          channelId: vc.id,
          adapterCreator: vc.guild
            .voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
        });

        conn.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
          Logger.log(`Executing Kanker`);
          Logger.log(
            `Current Kankertime | ${theTime} (${(theTime / 1000).toFixed(
              2
            )} sec)`
          );
          Logger.log(`VC Connected | Channel: ${vc.name}`);

          const player = createAudioPlayer({
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Pause,
            },
          });
          const r = createAudioResource(
            join(__dirname, `../assets/audio/kanker.wav`),
            { inlineVolume: true }
          );
          r.volume.setVolume(0.65);

          setTimeout(() => {
            conn.subscribe(player);
            player.play(r);
            Logger.log(
              `Playing Audio : ${join(__dirname, `../assets/audio/kanker.wav`)}`
            );
          }, theTime);

          player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            conn.disconnect();
            conn.destroy();
          });

          player.on('error', (e) => {
            Logger.log(`Error: ${e.message}`, true);
            player.stop();
            conn.disconnect();
            conn.destroy();
          });

          player.on('stateChange', (oldState, newState) => {
            Logger.log(
              `AP Status | Status Transition : ${oldState.status} => ${newState.status}`
            );
          });
        });

        conn.on('stateChange', (oldState, newState) => {
          Logger.log(
            `VC Status | State Transition : ${oldState.status} => ${newState.status}`
          );
        });
      } catch (e) {
        Logger.log('Exception Error', true);
        console.error(e);
      }
    } else {
      interaction.reply({
        content: `Join VC to execute this horrifying function`,
        ephemeral: true,
      });
    }
  }

  // admin only: instant kanker
  @Permission(false)
  @Permission({ id: '422067493578997760', type: 'ROLE', permission: true })
  @Permission({ id: '421794339371352074', type: 'ROLE', permission: true })
  @Slash('tactkank', { description: 'Kanker but instant, Admin only' })
  private async tactkank(
    interaction: CommandInteraction,
    client: Client
  ): Promise<void> {
    Logger.log(`Executing Tactical Kanker`);
    try {
      VoiceFunctions.voiceEmitter(
        interaction,
        client,
        'kanker.wav',
        0.65,
        'Tactical Kanker Incoming'
      );
    } catch (e) {
      Logger.log('Exception Error', true);
      console.error(e);
    }
  }

  // @Slash('leave', { description: 'Leaves voice channel' })
  // private async leave(
  //   interaction: CommandInteraction,
  //   client: Client
  // ): Promise<void> {
  //   // command.member.voice.channel ? command.member.voice.channel.leave() : false;
  // }
}
