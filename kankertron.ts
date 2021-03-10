import { Client } from "@typeit/discord";
import * as dotenv from 'dotenv'
dotenv.config()

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static start(): void {
    this._client = new Client();
    this._client.login(
      process.env.CLIENT_TOKEN,
      `${__dirname}/discords/*.ts`,
      `${__dirname}/discords/*.js`
    );

    console.log('Gratis Saus');
  }
}

Main.start();
