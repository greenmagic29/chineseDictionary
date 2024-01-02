import { db } from "../db";

interface StarDict {
  id: number;
  word: string;
  sw: string;
  phonetic: string;
  definition: string;
  translation: string;
  exchange: any[];
}
const posMap:any = {
  'a': 'pron.',
  'c': 'conj.',
  'd': 'determiner',
  'i': 'prep.',
  'j': 'adj.',
  'm': 'num.',
  'n': 'noun',
  'p': 'pron.',
  'r': 'adv.',
  'u': 'interjection',
  't': 'infinitive',
  'v': 'v.',
  'x': 'not'
};
const exchangeMap:any = {
  'p': 'Past Tense',
  'd': 'Past Participle',
  'i': 'Present Participle',
  '3': 'Third-person Singular',
  'r': 'Comparative',
  't': 'Superlative',
  's': 'Plural',
  '0': 'Prototype',
  'l': 'Original'
};

function getExchangeMap(exchangeString: string) {
  const parsedItem = exchangeString.split(':');
  switch(parsedItem[0]) {
    case 'l':
      return `${exchangeMap[parsedItem[0]]}: ${posMap[parsedItem[1]]}`;
    case 'p':
    case 'd':
    case 'i':
    case '3':
    case 'r':
    case 't':
    case 's':
    case '0':
      return `${exchangeMap[parsedItem[0]]}: ${parsedItem[1]}`
  }
}
export class StarDictModel {
  //private starDicts: StarDict[] = [];
  static async parseExchange(exchange: string) {
    if(!exchange) {
      return []
    }
    //split by /
    const exchangeArray = exchange.split('/');
    const parsedArray = exchangeArray.map(i => {
      return getExchangeMap(i);
    });
    return parsedArray;
  }
  static async parseDbValues(result: any[]):Promise<StarDict[]> {
    return Promise.all(result.map(async res => {
      return {
       id: res.id,
       word: res.word,
       sw: res.sw,
       phonetic: res.phonetic,
       definition: res.definition,
       translation: res.translation,
       exchange: await StarDictModel.parseExchange(res.exchange)
      } 
     })
    )
  }
  static async getStarDictById(id: string) {
    const result = await db(`select * from stardict where id = @id`, {'@id': id});
    const final = await this.parseDbValues(result);
    
    return final;
  }

  static async getStarDictByWord(word: string) {
    const result = await db(`select * from stardict where word = @word`, {'@word': word});
    const final = await this.parseDbValues(result);
    
    return final;
  }

  static async getRelatedWord(keyword: string) {
    const result = await db(`select * from stardict where word >= @keyword limit 10`, {'@keyword': keyword});
    const final = await this.parseDbValues(result);
    return final;
  }

}