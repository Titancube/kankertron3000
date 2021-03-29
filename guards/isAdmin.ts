import { GuardFunction } from "@typeit/discord";

export const isAdmin: GuardFunction<"message"> = async (
  [message],
  client,
  next
) => {
  if (message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true })) {
    await next();
  }
};
