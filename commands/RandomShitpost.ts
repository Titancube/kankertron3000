import { Command, CommandMessage, Infos } from '@typeit/discord';
import axios from 'axios';
import { randomInt } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

export abstract class RandomShitpost {
  @Command('randomeoti')
  @Infos({
    command: `randomeoti`,
    detail: '`$randomeoti`',
    description: '* Posts a random EOTI track.',
  })
  private async randomEoti(command: CommandMessage): Promise<void> {
    this.fetchTracks('Explorers%20of%20the%20Internet', 'kanker!', command);
  }

  @Command('randomshittypedia')
  @Infos({
    command: `randomshittypedia`,
    detail: '`$randomshittypedia`',
    description: '* Posts a random Shittypedia track.',
  })
  private async randomShittypedia(command: CommandMessage): Promise<void> {
    this.fetchTracks('Shittypedia', 'gangnam style!', command);
  }

  /**
   * Fetch tracks from API response
   * @param target search target
   * @param message which being sent on the channel
   * @param command `CommandMessage`
   */
  private async fetchTracks(
    target: string,
    message: string,
    command: CommandMessage
  ) {
    const api = `https://api.soundcloud.com/tracks?q=${target}&access=playable&limit=50&linked_partitioning=true&client_id=`;
    const searchResults = await axios.get(api + process.env.SC_CLIENT_ID, {
      headers: { Authorization: 'Bearer' + process.env.SC_OAUTH_TOKEN },
    });
    const randomTrackNumber = randomInt(0, 50);

    command.channel.send(
      `Enjoy your free ${message} ${searchResults.data.collection[randomTrackNumber].permalink_url}`
    );
  }
}
