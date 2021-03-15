import { Command, CommandMessage } from '@typeit/discord'
import db from '../plugins/firebase'

export abstract class Penis {

    description: `\`$penis\``
    detail: `\`$penis\`
    
    You get what you get
    `

    @Command("penis")
    private async penis(command: CommandMessage): Promise<void> {
        const testicles = '3'
        const glans = 'D'
        const stick = '='

        const snapshot = db.collection('Member').doc(command.author.id)
        const r = await snapshot.get()

        const fate = (): number => { return Math.floor(Math.random() * 100) }

        const penisConstructor = (n: number): number => {

            if (n < 95 || n + 1 > 500) {
                return n
            }

            return n + n * penisConstructor(fate())
        }

        if (r) {
            if (r.data().penis) {
                command.channel.send(r.data().penis)
            } else {
                const penis = testicles + stick.repeat(penisConstructor(fate()) / 10) + glans
                await snapshot.set({ penis: penis }, { merge: true })
                command.channel.send(penis)
            }
        } else {
            command.channel.send('err')
        }

    }
}
