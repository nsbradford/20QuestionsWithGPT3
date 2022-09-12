import { Configuration, OpenAIApi } from 'openai';
import { Message } from './../components/Utils';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// req = HTTP incoming message, res = HTTP server response
export default async function handler(req, res) {
  const prompt: string = generatePrompt(req.body.messages);
  const isStub: boolean = req.body.isStub;
  if (isStub) {
    console.log(`About to send prompt{\n${prompt}\n}`);
    await sleep(2000);
    res.status(200).json({ result: 'Stub result' });
  } else {
    console.log('WTFFFFFFFFF');
    // const completion = await openai.createCompletion({
    //   model: "text-davinci-002",
    //   prompt: prompt,
    //   temperature: 0.6,
    // });
    // res.status(200).json({ result: completion.data.choices[0].text });
    res.status(200).json({ result: 'YIKES, you hit the OpenAI API!' });
  }
}

export function generatePrompt(messages: Message[]): string {
  const merged = messages.map(m => m.rawContent).join('\n');
  return merged;
}
