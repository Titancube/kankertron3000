import { GuardFunction } from '@typeit/discord';

export const IsAdmin: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  if (message.member.hasPermission('ADMINISTRATOR', { checkAdmin: true })) {
    await next();
  }
};
