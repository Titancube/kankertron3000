import { format } from 'date-fns';
import fs from 'fs';

export class Misc {
  static get currentTime(): string {
    return format(new Date(), 'MM-dd HH:mm:ss.SSS');
  }
}

export class Logger {
  static log(str: string, error?: boolean): void {
    const msgConstructor: string[] = [
      Misc.currentTime,
      '|',
      error ? `<<!>>` + str : str,
    ];
    const msg = msgConstructor.join(' ');
    error ? console.error(msg) : console.log(msg);
    Logger.writeLog(msg);
  }

  static writeLog(str: string): void {
    const today = format(new Date(), 'YYYY-mm-DD');
    const logFileName = `kankertron_${today}.log`;
    try {
      fs.appendFileSync(`../log/${logFileName}`, str);
    } catch (error) {
      console.error;
    }
  }
}
