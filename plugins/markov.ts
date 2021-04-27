// https://medium.com/@alexkrameris/markov-chain-implementation-in-javascript-a698f371d66f
// My own implementation in typescript of Alex Kramer's original javascript version

export class Markov {
  private static state: string[] = [];
  private static markovChain = {};

  static addState(text: Array<string> | string): void {
    if (Array.isArray(text)) {
      Array.from(text).forEach((v: string) =>
        v.split(' ').forEach((n: string) => Markov.state.push(Markov.trim(n)))
      );
    } else if (typeof text == 'string') {
      text.split(' ').forEach((v: string) => Markov.state.push(Markov.trim(v)));
    }
  }

  private static trim(text: string): string {
    return text.toLowerCase().replace(/[\W_]/, '');
  }

  static train(): void {
    const textArr = Markov.state;

    for (let i = 0; i < textArr.length; i++) {
      const word = textArr[i].toLowerCase().replace(/[\W_]/, '');
      if (!Markov.markovChain[word]) {
        Markov.markovChain[word] = [];
      }
      if (textArr[i + 1]) {
        Markov.markovChain[word].push(
          textArr[i + 1].toLowerCase().replace(/[\W_]/, '')
        );
      }
    }
  }

  static generate(count: number): string {
    const words = Object.keys(Markov.markovChain);
    let word = words[Math.floor(Math.random() * words.length)];
    let result = '';
    for (let i = 0; i < count; i++) {
      result += word + ' ';
      const newWord =
        Markov.markovChain[word][
          Math.floor(Math.random() * Markov.markovChain[word].length)
        ];
      word = newWord;
      if (!word || !Markov.markovChain)
        word = words[Math.floor(Math.random() * count)];
    }
    return result;
  }
}
