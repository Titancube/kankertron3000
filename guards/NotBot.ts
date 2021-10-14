import { ArgsOf, GuardFunction } from 'discordx';

export const NotBot: GuardFunction<ArgsOf<'messageCreate'>> = async (
  [message],
  client,
  next
) => {
  if (!client.user.bot) {
    await next();
  }
};
