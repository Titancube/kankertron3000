import { ArgsOf, Guard, On } from "@typeit/discord";
import { IsRefugee } from "../guards/IsRefugee";
import { NotBot } from "../guards/NotBot";
import db from '../plugins/firebase'

export abstract class Remember {
    @On("message")
    @Guard(
        NotBot,
        IsRefugee
    )
    async remember([msg]: ArgsOf<"message">): Promise<void> {
        // Cancel saving if the message is a command
        if (msg.content.startsWith("$") || msg.channel.id === '474258213655805972') { return }
        // Save in DB 
        try {
            await db.collection('Member').doc(msg.author.id).collection('Messages').doc(msg.id).set({
                message: msg.content, // Actual message
                createdAt: msg.createdAt, // When did the message created
            }, { merge: true })
        } catch (e) {
            console.log(e)
        }

    }
}