import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import react from 'react';
import React from 'react';

export function NavBar() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-violet-400 p-6">
      {/* <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
        <span className="font-semibold text-xl tracking-tight">Play 20 Questions with GPT-3</span>
      </div> */}
     
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>

      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
            About
          </a>
          <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}





export type UseState<S> = [S | undefined, react.Dispatch<react.SetStateAction<S | undefined>>];

enum MessageType {
  User,
  GPT3,
  Admin,
}

export type Message = {
  messageType: MessageType;
  index: number;
  rawContent: string;
  content: string;
}

const dummyMessages: Message[] = [
  {
    messageType: MessageType.GPT3,
    index: 0,
    rawContent: "",
    content: "Ah, another mere mortal seeks to defeat me.",
  },
  {
    messageType: MessageType.GPT3,
    index: 1,
    rawContent: "",
    content: "Ready your questions, challenger. I have chosen my topic.",
  },
  {
    messageType: MessageType.User,
    index: 2,
    rawContent: "",
    content: "Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? Is it an animal? ",
  }
];


export function Game() {
  const [messages, setMessages]: UseState<Message[]> = React.useState();
  // TODO calculate number of valid messages, win condition, etc
  // setMessages(dummyMessages);

  const renderedMessages = (
    dummyMessages.map((message) => { 
      const mystyle = message.messageType === MessageType.User ? styles.bubbleright : styles.bubbleleft;
      return <li key={message.index}><div className={mystyle}>{message.content}</div></li>
    })
  );

  return (
    <div>
      <div className="m-4 p-1 outline outline-2 outline-slate-200 rounded-lg">
        <ul className="flex flex-col">
          {renderedMessages}
        </ul>
      </div>

      <label className="block text-center text-gray-700 text-sm font-bold mb-2">
        Ask yes/no question here:
      </label>
      <div className="flex place-content-center">
        <input className="max-w-[70%] m-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text"  />
      </div>
    </div>
  );
}


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>20 Questions with GPT-3</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <NavBar />

      <main className={styles.main}>
        <div className="">
          <h1 className="text-4xl m-5">Play 20 Questions with GPT-3</h1>
          <h2 className="text-lg">Can you defeat the world's smartest AI?</h2>
          <p className="text-xs italic p-4">By playing, I agree to the <a className="hover:underline text-violet-400" href="">terms of service</a>, mainly acklowledging the AI might say some pretty wild stuff.</p>

        </div>
      </main>

      <Game />
    </>
  );
};

export default Home;