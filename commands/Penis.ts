import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import db from '../plugins/firebase';

@Discord()
export abstract class Penis {
  @Slash('penis', { description: 'You get what you get' })
  private async penis(interaction: CommandInteraction): Promise<void> {
    const testicles = '3';
    const glans = 'D';
    const stick = '=';
    const snapshot = db.collection('Member').doc(interaction.member.user.id);
    const r = await snapshot.get();

    const fate = (): number => {
      return Math.floor(Math.random() * 100);
    };

    const penisConstructor = (n: number): number => {
      if (n < 80 || n + 1 > 500 || n + penisConstructor(fate()) > 500) {
        interaction.reply(`The god has rolled the dice!`);
        return n;
      }
      interaction.reply(
        `The god has has rolled the Jackpot and rolling the dice again!`
      );
      return n + penisConstructor(fate());
    };

    const godHasSpoken = async () => {
      const penis =
        testicles + stick.repeat(penisConstructor(fate()) / 10) + glans;
      await snapshot.set({ penis: penis }, { merge: true });
      interaction.reply(penis);
    };

    r.exists && r.data().penis !== undefined
      ? interaction.reply(r.data().penis)
      : godHasSpoken();
  }
}
