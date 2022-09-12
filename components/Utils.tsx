import react from 'react';

export type UseStateUndefined<S> = [
  S | undefined,
  react.Dispatch<react.SetStateAction<S | undefined>>
];

export type UseState<S> = [S, react.Dispatch<react.SetStateAction<S>>];

export enum MessageType {
  User,
  GPT3,
  Admin,
}

export type Message = {
  messageType: MessageType;
  index: number;
  rawContent: string;
  content: string;
};

export const dummyMessages: Message[] = [
  {
    messageType: MessageType.GPT3,
    index: 0,
    rawContent: 'Ah, another mere mortal seeks to defeat me.',
    content: 'GPT-3: Ah, another mere mortal seeks to defeat me.',
  },
  {
    messageType: MessageType.GPT3,
    index: 1,
    rawContent: 'Ready your questions, challenger. I have chosen my topic.',
    content: 'GPT-3: Ready your questions, challenger. I have chosen my topic.',
  },
  // {
  //   messageType: MessageType.User,
  //   index: 2,
  //   rawContent: 'Human: Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? ',
  //   content:
  //     'Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? ',
  // },
];

