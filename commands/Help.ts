import {
  Client,
  Command,
  CommandMessage,
  Description,
  Infos,
} from '@typeit/discord';

export abstract class Help {
  @Command('help :mTarget')
  @Infos({
    command: 'help',
    detail: '`$help <Command>`',
    description: '* Get general info about all or specific command',
  })
  @Description('Get general info about all commands')
  private async help(command: CommandMessage): Promise<void> {
    const { mTarget } = command.args;
    const details = Client.getCommands();
    const title =
      '**Commands List**\n\nType `$help <command>` to see description';
    let str = '';
    if (!mTarget) {
      details.forEach((v) => {
        str += v.infos.command + ' - ' + v.infos.detail + '\n';
      });
      command.channel.send(title + str);
    } else {
      const result = details.filter(
        (v) => v.infos.command === mTarget.toString()
      );
      if (result.length > 0) {
        str = result[0].infos.detail + '\n\n' + result[0].infos.description;
        command.channel.send(str);
      } else {
        command.channel.send('The command does not exist');
      }
    }
  }
}
