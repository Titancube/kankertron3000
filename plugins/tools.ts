export class Validate {
  /**
   * Check if `id` is valid.
   * Also trims `<!@...> or <@...>`
   * @param id
   * @returns `boolean`
   */
  static user(id: string): boolean {
    const validate = new RegExp(/([0-9])+/g);
    return id && validate.exec(id)[0] ? true : false;
  }

  /**
   * Trims discord mention's head & tail i.e `<!@...>`
   * @param user discord mention
   * @returns parsed by regex
   */
  static userStringParser(user: string): string {
    const validate = new RegExp(/([0-9])+/g);
    return validate.exec(user)[0];
  }

  /**
   * Check user and return the parsed data
   * @param id Discord user id
   * @returns Parsed user id or ''
   */
  static userValidateAndParse(id: string): string {
    return this.user(id) ? this.userStringParser(id) : '';
  }

  /**
   * Check if the property can be parsed into number and returns it
   * @param num unknown
   * @returns Parsed number if the `num` could be parsed
   */
  static checkNumber(num: unknown): boolean {
    try {
      return typeof num == 'number' ? true : false;
    } catch (e) {
      console.error(`[${new Date()}] ${e}`);
    }
  }
}
