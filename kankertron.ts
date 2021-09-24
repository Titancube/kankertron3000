import { Client } from "@typeit/discord";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "./.env") });

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static start(): void {
    this._client = new Client();
    this._client.login(
      process.env.CLIENT_TOKEN!,
      `${__dirname}/discords/*.ts`,
      `${__dirname}/discords/*.js`
    );

    console.log(`[${new Date()}] Gratis Saus`);
  }
}

Main.start();
