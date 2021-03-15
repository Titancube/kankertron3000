import { Command, CommandMessage } from '@typeit/discord'
import * as CommandList from '../imports/index'

export abstract class Help {

    description: `\`$help\``
    detail: `\`$help <command?>\`
    
    Exmaple: \`$help say\`
    Get general info about all commands or detailed guide about the targeted command
    `

    @Command("help :mTarget")
    private async help(command: CommandMessage): Promise<void> {

        const { mTarget } = command.args
        console.log(CommandList)

        if (mTarget) {
            command.channel.send('[help] Mesage with targeted function')
        } else {
            command.channel.send('[help] Message without targeted function')
        }
    }
}