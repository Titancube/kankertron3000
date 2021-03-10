import { Command, CommandMessage } from "@typeit/discord";
import db from '../plugins/firebase'
import Markov from 'js-markov'
export abstract class Say {
    @Command("say :person :history")
    async say(command: CommandMessage): Promise<void> {
        const { person, history } = command.args
        const msgCount = Math.floor(history)

        const subject = person.substr(3, person.indexOf(">") - 3)

        if (msgCount > 1000 || msgCount < 0) {
            command.channel.send('Count of message history cannot be higher than 1000 or lower than 0')
            return
        }

        const wordsToTrain = []
        const markov = new Markov()

        const samples = await db.collection('Member').doc(subject).collection('Messages').orderBy('createdAt', 'desc').limit(msgCount).get()

        samples.forEach(r => {
            wordsToTrain.push(r.data().message)
        })

        markov.addStates(wordsToTrain)
        markov.train()
        command.channel.send(markov.generateRandom());

    }
}
