import { Command, CommandMessage, Infos } from "@typeit/discord";


export abstract class Saus {

    @Command("saus")
    @Infos({
        command: `saus`,
        detail: `\`$saus\`

* Gratis saus
    `
    })
    async saus(command: CommandMessage): Promise<void> {
        command.channel.send('gratis saus')
    }
}
