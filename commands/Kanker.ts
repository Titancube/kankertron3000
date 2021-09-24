import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import {
  Client,
  Description,
  Discord,
  Permission,
  Slash,
} from '@typeit/discord';
import { CommandInteraction } from 'discord.js';
import { VoiceFunctions } from '../plugins/tools';

@Discord()
export abstract class Kanker {
  @Slash('kanker')
  @Description('Kanker')
  private async kanker(
    interaction: CommandInteraction,
    client: Client
  ): Promise<void> {
    // const vc = interaction.member.voice.channel;
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
        console.log(`VC Connected | Channel: ${vc.name}`);
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
        });
        const play = async () => {
          const r = createAudioResource(`../assets/audio/kanker.wav`);
          r.volume.setVolume(0.65);

          player.play(r);

          conn.subscribe(player);

          player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            conn.disconnect();
            conn.destroy();
          });

          player.on('error', (e) => {
            console.error(`Error: ${e.message}`);
            player.stop();
            conn.disconnect();
            conn.destroy();
          });
        };

        setTimeout(play, theTime);
      });
    } else {
      interaction.channel.send(`Join VC to execute this horrifying function`);
    }
  }

  // admin only: instant kanker
  @Permission('422067493578997760', 'ROLE')
  @Slash('tactkank')
  @Description('Kanker but instant, Admin only')
  private async tactkank(
    interaction: CommandInteraction,
    client: Client
  ): Promise<void> {
    VoiceFunctions.voiceEmitter(interaction, client, 'kanker.wav', 0.65);
  }

  // leaves voice channel
  @Slash('leave')
  @Description('Leaves voice channel')
  private async leave(
    interaction: CommandInteraction,
    client: Client
  ): Promise<void> {
    // command.member.voice.channel ? command.member.voice.channel.leave() : false;
  }

  @Slash('test')
  @Description('Test function')
  private async test(interaction: CommandInteraction, client: Client) {
    interaction.channel.send('Test');
  }
}
