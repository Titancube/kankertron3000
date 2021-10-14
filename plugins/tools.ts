import { format } from 'date-fns';
import * as fs from 'fs';

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

  static writeLog(str: string, direct?: boolean): void {
    const today = format(new Date(), 'yyyy-MM-dd');
    const logDirectory = `./log`;
    const logFileName = `kankertron_${today}.log`;
    try {
      if (direct) console.log(str);
      if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
      fs.appendFileSync(`${logDirectory}/${logFileName}`, str + '\r\n');
    } catch (error) {
      console.error;
    }
  }
}

export class Validate {
  /**
   * Filters discord's snowflake ID in given string
   * @param str
   * @returns Snowflake as string
   */
  static filterSnowflake(str: string): string {
    if (str.startsWith('<#') || (str.startsWith('<@') && str.endsWith('>'))) {
      const validate = new RegExp(/([0-9]+)/g);
      return validate.exec(str)[0];
    }
  }
}
