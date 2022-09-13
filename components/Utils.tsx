import typingIndicatorStyles from '../styles/TypingIndicator.module.scss';

import react from 'react';

export type UseStateUndefined<S> = [
  S | undefined,
  react.Dispatch<react.SetStateAction<S | undefined>>
];

export type UseState<S> = [S, react.Dispatch<react.SetStateAction<S>>];

export enum MessageType {
  User,
  GPT3,
}

export enum GameState {
  Won,
  Lost,
  NotStarted,
  InProgress,
}

export function isEnded(gameState: GameState): boolean {
  return gameState == GameState.Won || gameState == GameState.Lost;
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
  {
    messageType: MessageType.User,
    index: 2,
    rawContent:
      'Human: Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? ',
    content:
      'Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? ',
  },
];

export async function fetchResponseFromAPI(
  messages: Message[],
  answer: string | undefined,
  isStub: boolean
) {
  const response: Response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages: messages, answer: answer, isStub: isStub }),
  });
  return response;
}

// export async function

export function TypingIndicator() {
  return (
    // https://jsfiddle.net/Arlina/gtttgo93/
    <div className={`${typingIndicatorStyles.typingindicator} m-1`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
