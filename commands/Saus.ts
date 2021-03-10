import { Command, CommandMessage } from "@typeit/discord";
import db from '../plugins/firebase'
import { format, formatDistanceToNowStrict } from 'date-fns'
import ko from 'date-fns/locale/ko'

export abstract class Hello {
    @Command("saus")
    async retire(command: CommandMessage): Promise<void> {
        command.channel.send('gratis saus')
    }
}
