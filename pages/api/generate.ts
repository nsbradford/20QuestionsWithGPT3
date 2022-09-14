import { Configuration, OpenAIApi } from 'openai';
import { Message } from './../components/Utils';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// req = HTTP incoming message, res = HTTP server response
export default async function handler(req, res) {
  console.log(`Processing request...`);
  const messages: Message[] = req.body.messages;
  const isFirstPrompt = !messages.length;
  const isStub: boolean = req.body.isStub;
  console.log(messages);

  let response: string;
  let returnCode = 200;
  let answer: string = req.body.answer;

  if (isFirstPrompt) {
    await sleep(2000);
    answer = sample(candidates);
    response = sample(initialBanter);
  } else if (isStub) {
    await sleep(1000);
    if (messages.length && messages.at(-1).content.includes(answer)) {
      response = `Stub message. YOU WIN`;
    } else {
      response = `Stub message. Answer=${answer}`;
    }
  } else {
    const postfix: string = isFirstPrompt ? '' : '\nAnswerer:';
    const basePrompt: string = initialPrompt(answer);
    const prompt: string = basePrompt + mergeMessages(messages) + postfix;

    console.log(
      `******\nSending query to OpenAPI with api key ${process.env.OPENAI_API_KEY}:\n{${prompt}}`
    );
    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      temperature: 0.9,
      max_tokens: 32,
      stop: ['Questioner:', 'Answerer:'],
      // user:
    });
    // res.status(200).json({ result: completion.data.choices![0].text });
    console.log(`******\nReceived response from OpenAPI:\n`);
    // console.log(completion);
    // console.log(completion.data);
    // console.log(completion.data.choices![0].text!);
    response = 'Answerer:' + completion.data.choices![0].text!;
  }
  console.log(`Response: ${response}`);
  res.status(returnCode).json({ result: response, answer: answer });
}

export function mergeMessages(messages: Message[]): string {
  const merged = messages.map(m => m.rawContent).join('\n');
  return merged;
}

// https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
export function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const initialBanter: string[] = [
  // Fake
  // 'Banter: Ah, another mere mortal seeks to defeat me.',
  // 'Banter: Ready your questions, challenger. I have chosen my topic.',
  // Real
  'Banter: Ah, another challenger. I see you are eager to be defeated.',
  'Banter: I am prepared.',
  'Banter: This time, I will be victorious.',
  'Banter: Bring it on, weakling.',
];

// ideas from https://blog.prepscholar.com/20-questions-game
const candidates: string[] = [
  // 'Meerkat',
  // 'Blobfish',
  'Swan',
  'Vampire bat',
  'Manatee',
  'Humpback whale',
  'Snapping turtle',
  'Polar bear',
  'Chameleon',
  'Snowy owl',
  'Otter',
  'Octopus',
  'Sloth',
  'Flamingo',
  'Walrus',
  'Warthog',
  'Fox',
  'Raccoon',
  'Snow leopard',
  'Hedgehog',
  'Seahorse',
  'Hippopotamus',
  'Komodo dragon',
  'Great white shark',
  'Wildebeest',
  'Coyote',
  'Peregrine falcon',
  // places
  'Grand Canyon',
  'Times Square',
  'Antarctica',
  'Mt. Everest',
  'Death Valley',
  'Amazon Rainforest',
  'Machu Picchu',
  'Taj Mahal',
  'The White House',
  'Stonehenge ',
  'Disney World',
  'Louvre',
  'The North Pole',
  'Pearl Harbor',
  'Yellowstone National Park',
  'Great Barrier Reef',
  'Serengeti',
  'Angkor Wat',
  'Mount Rushmore',
  'Niagara Falls',
  'Mariana Trench',
  // food
  'Pizza',
  'Popcorn',
  'Cucumber',
  'Shrimp',
  'Waffles',
  'Mango',
  'Whipped cream',
  // 'Pigs in a blanket',
  'Swiss cheese',
  'Avocado',
  'Tater tots',
  'Cantaloupe',
  'Peanut butter and jelly sandwich',
  'Corn dog',
  'Sushi',
  'Plantain',
  'Fudge',
  'Fig',
  'Fajitas',
  'Cauliflower',
  'Jalapeno',
  'Salmon',
  'Bubble tea',
  'Bok choy',
  // 'S'mores',
  'Apple pie',
  'Sweet potato',
  // objects
  'Hula hoop',
  'Calendar',
  // 'King Tut's mask',
  // 'CD-ROM',
  'Pajamas',
  'Treehouse',
  'Rocking chair',
  'The Mona Lisa',
  // 'T-Rex',
  'Light bulb',
  'Palm tree',
  'Balloon',
  // 'The Crown Jewels',
  // 'Wrapping paper',
  'Penny',
  'Notebook',
  'Fire extinguisher',
  'Napkin',
  // 'Beret',
  'The Titanic',
  'Blender',
  'Stamp',
  'Yacht',
  'Volleyball',
  'Tissues',
  'Comet',
  'Hairbrush',
  'Mittens',
  'Chopsticks',
  'Magazine',
  // 'Piccolo',
  // 'Northern Lights',
  'Chessboard',
  'Christmas tree',
  // 'Stained glass',
  'Hollywood sign',
  'Tennis court',
];

function initialPrompt(answer: string) {
  return `This is a game of 20 Questions. All players are old-fashioned, noble, medieval, smart, funny, sarcastic, robotic, and competitive. To start, the Questioner asks NEW GAME. The Questioner must ask a Yes or No question, which may be followed by commentary. If it is not a valid Yes or No question, the answerer responds Invalid. Otherwise, the Answerer must answer truthfully either Yes or No. The Banter provides commentary from the Answerer. If the Questioner guesses the correct answer, the Answerer must respond YOU WIN.

Questioner: NEW GAME. 
Secret: The correct answer is a shark.
Banter: Ah, another mere mortal seeks to defeat me. Ready your questions, challenger. I have chosen my topic.
Questioner: Is it an animal?
Answerer: Yes. 
Banter: 'Twas the luck of beginners.
Questioner: Is it a vegetable?
Answerer: No. 
Banter: How could it be both animal and vegetable? Thus we see why machines shall inevitably conquer humans.
Questioner: Does it live in the land?
Answerer: No. 
Banter: Resistance is futile. 
Questioner: Does it live in the ocean?
Answerer: Yes. 
Banter: Given that we've already established it doesn’t live on land, I fear you have learned little.
Questioner: You have a slanderous tongue!
Answerer: Invalid. 
Banter: You must proffer a query in the Yes or No format.
Questioner: Fine. Is the animal a predator?
Answerer: Yes. 
Banter: Seems some humans do have a spark of intelligence.
Questioner:Is it bigger than a human?
Answerer: Yes.
Banter: Of course your human mind would frame the question in such an anthropocentric manner.
Questioner: Is it a whale?
Answerer: No. 
Banter: Absolutely not. To salvage what little honor you can for the human race, you should surrender.
Questioner: Aha! Do you fear my impending victory, frail human?
Answerer: Invalid. 
Banter: Perhaps your human mind cannot remember the rules. Shall I read them to you?
Questioner: Is it a shark?
Answerer: YOU WIN. 
Banter: I wallow in shame. I pray the tides of fate will bear me to more fortuitous contests in the future.
Questioner: NEW GAME.
Secret: The correct answer is ${answer}.
`;
}
