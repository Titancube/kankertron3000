import { GuardFunction } from "@typeit/discord";

export const IsRefugee: GuardFunction<"message"> = async (
    [message], client, next
) => {
    if (message.guild.id === "421792855506419714") {
        await next()
    }
}