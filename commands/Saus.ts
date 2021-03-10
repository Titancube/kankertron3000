import { Command, CommandMessage } from "@typeit/discord";

export abstract class Saus {
    @Command("saus")
    async saus(command: CommandMessage): Promise<void> {
        command.channel.send('gratis saus')
    }
}
