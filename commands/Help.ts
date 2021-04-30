import { Client, Command, CommandMessage, Infos } from '@typeit/discord';

export abstract class Help {
  @Command('help :_targetCommand')
  @Infos({
    command: 'help',
    detail: '`$help <Command>`',
    description: '* Get general info about all or specific command',
  })
  private async help(command: CommandMessage): Promise<void> {
    const { _targetCommand } = command.args;
    const commandList = Client.getCommands();
    const messageTitle =
      '**Commands List**\n\nType `$help <command>` to see description';
    let str = '\n\n';

    if (!_targetCommand) {
      commandList.forEach((el) => {
        str += el.infos.command + ' - ' + el.infos.detail + '\n';
      });
      command.channel.send(messageTitle + str);
    } else {
      const searchResult = commandList.find(
        (el) => el.infos.command === _targetCommand.toString()
      );

      if (searchResult) {
        str =
          searchResult.infos.detail + '\n\n' + searchResult.infos.description;
        command.channel.send(str);
      } else {
        command.channel.send('The command does not exist');
      }
    }
  }
}
