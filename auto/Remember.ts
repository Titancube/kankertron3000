import { Guard, On } from "@typeit/discord";
import { Message, MessageAttachment } from "discord.js";
import { IsRefugee } from "../guards/IsRefugee";
import { NotBot } from "../guards/NotBot";
import db from '../plugins/firebase'

export abstract class Remember {
    @On("message")
    @Guard(
        NotBot,
        IsRefugee
    )
    async remember(msg: Message, msgAtc: MessageAttachment): Promise<void> {
        // save 
        db.collection('Member').doc(msg.author.id).collection('Messages').doc(msg.id).set({
            message: msg.content, // Actual message
            createdAt: msg.createdAt, // When did the message created
            attachment: msgAtc.url
        }, { merge: true })
    }
}