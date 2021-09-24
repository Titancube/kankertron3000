import { Slash, Description } from "@typeit/discord";
import db from "../plugins/firebase";

export abstract class Penis {
  @Slash("penis")
  @Description("* You get what you get")
  private async penis(command: CommandMessage): Promise<void> {
    const testicles = "3";
    const glans = "D";
    const stick = "=";
    const snapshot = db.collection("Member").doc(command.author.id);
    const r = await snapshot.get();

    const fate = (): number => {
      return Math.floor(Math.random() * 100);
    };

    const penisConstructor = (n: number): number => {
      if (n < 80 || n + 1 > 500 || n + penisConstructor(fate()) > 500) {
        command.channel.send(`The god has rolled the dice!`);
        return n;
      }
      command.channel.send(
        `The god has has rolled the Jackpot and rolling the dice again!`
      );
      return n + penisConstructor(fate());
    };

    const godHasSpoken = async () => {
      const penis =
        testicles + stick.repeat(penisConstructor(fate()) / 10) + glans;
      await snapshot.set({ penis: penis }, { merge: true });
      command.channel.send(penis);
    };

    r.exists && r.data().penis !== undefined
      ? command.channel.send(r.data().penis)
      : godHasSpoken();
  }
}
