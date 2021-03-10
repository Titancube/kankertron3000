import { Command, CommandMessage } from "@typeit/discord";
import db from '../plugins/firebase'
import { MarkovChain } from "@0x77/markov-typescript";

export abstract class Say {
    @Command("say :person :number")
    async say(command: CommandMessage): Promise<void> {
        const impersonatee = command.args.person
        const msgCount = command.args.number

        console.log(impersonatee)

        if (msgCount > 100 || msgCount < 0) {
            command.channel.send('Message count cannot be higher than 100 or lower than 0')
            return
        }

        const samples = await db.collection('Member').doc(impersonatee).collection('Messages').orderBy('createdAt', 'desc').limit(msgCount).get()
        const chain = new MarkovChain<string>(msgCount);
        samples.forEach(r => {
            chain.learn(r.data().message.split(" "));
        })

        for (let x = 0; x < Math.floor(Math.random() * 100); x++) {
            command.channel.send(chain.walk().join(" "));
        }
    }
}
