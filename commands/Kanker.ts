import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import { Client, Discord, Permission, Slash } from 'discordx';
import { CommandInteraction } from 'discord.js';
import { Logger, VoiceFunctions } from '../plugins/tools';

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
        const play = async () => {
          const r = createAudioResource(
            __dirname + `../assets/audio/kanker.wav`,
            { inlineVolume: true }
          );
          r.volume.setVolume(0.65);
          conn.subscribe(player);
          player.play(r);

          player.on(AudioPlayerStatus.Idle, async () => {
            player.stop();
            conn.disconnect();
            conn.destroy();
          });

          player.on('error', async (e) => {
            Logger.error(`Error: ${e.message}`);
            player.stop();
            conn.disconnect();
            conn.destroy();
          });
        };

        setTimeout(play, theTime);
      });
    } else {
      interaction.reply(`Join VC to execute this horrifying function`);
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
    interaction.reply({ content: 'Tactical Kank Incoming', ephemeral: true });
    VoiceFunctions.voiceEmitter(interaction, client, 'kanker.wav', 0.65);
  }

  // @Slash('leave', { description: 'Leaves voice channel' })
  // private async leave(
  //   interaction: CommandInteraction,
  //   client: Client
  // ): Promise<void> {
  //   // command.member.voice.channel ? command.member.voice.channel.leave() : false;
  // }
}
