import { Command, CommandMessage, Infos } from "@typeit/discord";
import db from '../plugins/firebase'
import Markov from 'js-markov'

export abstract class Say {



    @Command("say :mPerson :mHistory :mCount")
    @Infos({
        command: `say`,
        detail: `\`$say <Mention> <History?: default 50> <Count?: default 15>\`
    
* Speaks randomly generated sentence depends on the mentioned person's chat history
* Message will be generated with the amount of maximum words specified with \`<Count>\` based on number of histories specifed with \`<History>\`
* If the person mentioned usually says short words, the result is also likely to be short
* \`<Count>\` **limits** the maximum words, not forcing it
        `
    })
    private async say(command: CommandMessage): Promise<void> {
        const { mPerson, mHistory, mCount } = command.args
        const history = mHistory ? Math.floor(mHistory) : 50
        const person = this.userStringParser(mPerson)
        const count = mCount ? Math.floor(mCount) : 15
        console.log(`[${new Date()}] User: ${person} | History: ${history} | Count: ${count}`)

        if (history > 1000 || history < 0) {
            command.channel.send('Count of message history cannot be higher than 1000 or lower than 0')
            return
        }

        if (person === '') {
            command.channel.send('Invalid user')
        }

        const wordsToTrain = []
        const markov = new Markov()
        const samples = await db
            .collection('Member')
            .doc(person)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
            .limit(history)
            .get()

        if (samples) {
            samples.forEach(r => {
                wordsToTrain.push(r.data().message)
            })

            markov.addStates(wordsToTrain)
            markov.train()
            const theWiseWord: string = markov.generateRandom(count)
            theWiseWord.length ? command.channel.send(theWiseWord) : command.channel.send('No message was generated, try again!');

        }

    }

    private userStringParser(user: string) {
        const validate = new RegExp(/([0-9])+/g)

        if (!user) {
            return ''
        } else {
            return validate.exec(user)[0]
        }
    }
}
