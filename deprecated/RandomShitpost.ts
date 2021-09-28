import { Discord, Slash } from 'discordx';
import axios from 'axios';
import { randomInt } from 'crypto';
import * as dotenv from 'dotenv';
import { CommandInteraction } from 'discord.js';
dotenv.config({ path: __dirname + '/.env' });

@Discord()
export abstract class RandomShitpost {
  @Slash('randomeoti', { description: 'Posts a random EOTI track' })
  private async randomEoti(interaction: CommandInteraction): Promise<void> {
    this.fetchTracks('Explorers%20of%20the%20Internet', 'kanker!', interaction);
  }

  @Slash('randomshittypedia', {
    description: 'Posts a random Shittypedia track',
  })
  private async randomShittypedia(
    interaction: CommandInteraction
  ): Promise<void> {
    this.fetchTracks('Shittypedia', 'gangnam style!', interaction);
  }

  /**
   * Fetch tracks from API response
   * @param target search target
   * @param message which being sent on the channel
   * @param interaction `CommandMessage`
   */
  private async fetchTracks(
    target: string,
    message: string,
    interaction: CommandInteraction
  ) {
    const api = `https://api.soundcloud.com/tracks?q=${target}&access=playable&limit=50&linked_partitioning=true&client_id=`;
    const searchResults = await axios.get(api + process.env.SC_CLIENT_ID, {
      headers: { Authorization: 'Bearer' + process.env.SC_OAUTH_TOKEN },
    });
    const randomTrackNumber = randomInt(0, 50);

    interaction.reply({
      content: `Enjoy your free ${message} ${searchResults.data.collection[randomTrackNumber].permalink_url}`,
      ephemeral: false,
    });
  }
}
