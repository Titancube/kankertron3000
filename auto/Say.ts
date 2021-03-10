import { Command, CommandMessage } from "@typeit/discord";
import * as Markov from '@0x77/markov-typescript'
import db from '../plugins/firebase'

export abstract class Say {
    @Command("say :person :number")
    async saus(command: CommandMessage): Promise<void> {
        const personToImpersonate = command.args.person
        const msgCount = command.args.number
        console.log(command.args.person)


        // db.collection('Member').doc(command.args.person)
        // command.channel.send('gratis saus')
    }
}
