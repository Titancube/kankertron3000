import { Command, CommandMessage, Infos } from '@typeit/discord';
import { randomInt } from 'node:crypto';
import Soundcloud from "soundcloud.ts";

export abstract class RandomEoti {
  @Command('randomeoti')
  @Infos({
    command: `randomeoti`,
    detail: '`$randomeoti`',
    description: '* Posts a random EOTI track.',
  })
  private async randomeoti(command: CommandMessage): Promise<void> {
    const soundcloud = new Soundcloud();
    const user = await soundcloud.users.getV2("explorersoftheinternet");
    const trackCount = await user.track_count;
    const searchResults = await soundcloud.tracks.searchV2({q: "Explorers of the Internet"});
    const randomTrackNumber = randomInt(0, trackCount);
    
    command.channel.send('Enjoy your free kanker! ' + searchResults.collection[randomTrackNumber].permalink_url);
  }
}

export abstract class RandomShittypedia {
  @Command('randomshittypedia')
  @Infos({
    command: `randomshittypedia`,
    detail: '`$randomshittypedia`',
    description: '* Posts a random Shittypedia track.',
  })
  private async randomeoti(command: CommandMessage): Promise<void> {
    const soundcloud = new Soundcloud();
    const user = await soundcloud.users.getV2("shittypedia");
    const trackCount = await user.track_count;
    const searchResults = await soundcloud.tracks.searchV2({q: "Shittypedia"});
    const randomTrackNumber = randomInt(0, trackCount);
    
    command.channel.send('Enjoy your free gangnam style! ' + searchResults.collection[randomTrackNumber].permalink_url);
  }
}