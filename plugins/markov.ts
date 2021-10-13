// https://medium.com/@alexkrameris/markov-chain-implementation-in-javascript-a698f371d66f
// My own implementation in typescript of Alex Kramer's original javascript version
export class Markov {
  private state: string[] = [];
  private markovChain: { [index: string]: string[] } = {};

  addState(text: Array<string> | string): void {
    if (Array.isArray(text)) {
      Array.from(text).forEach((v: string) =>
        v.split(' ').forEach((n: string) => this.state.push(Markov.trim(n)))
      );
    } else if (typeof text == 'string') {
      text.split(' ').forEach((v: string) => this.state.push(Markov.trim(v)));
    }
  }

  static trim(text: string): string {
    return text.toLowerCase().replace(/[\W_]/, '');
  }

  init(): void {
    this.markovChain = {};
  }

  train(): void {
    const textArr = this.state;

    for (let i = 0; i < textArr.length; i++) {
      const word = textArr[i].toLowerCase().replace(/[\W_]/, '');
      if (!this.markovChain[word]) {
        this.markovChain[word] = [];
      }
      if (textArr[i + 1]) {
        this.markovChain[word].push(
          textArr[i + 1].toLowerCase().replace(/[\W_]/, '')
        );
      }
    }
  }

  generate(count: number): string {
    const words = Object.keys(this.markovChain);
    let word = words[Math.floor(Math.random() * words.length)];
    let result = '';
    for (let i = 0; i < count; i++) {
      result += word + ' ';
      const newWord =
        this.markovChain[word][
          Math.floor(Math.random() * this.markovChain[word].length)
        ];
      word = newWord;
      if (!word || !this.markovChain)
        word = words[Math.floor(Math.random() * count)];
    }
    return result;
  }

  /**
   * Filters valid sentences to train markov chain
   * @param arr unfiltered message history
   * @param count minimum length of the array of message history split by whitespace
   * @returns array of filtered
   */
  static wordsFilter(arr: Array<string>, count: number): Array<string> {
    for (let i = count; i > 0; i--) {
      const newArr: Array<string> = arr.filter((s) => s.split(' ').length >= i);
      if (newArr.length >= 5) return newArr;
    }
  }
}
