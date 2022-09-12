import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import react from 'react';
import React from 'react';
import { useFormik } from 'formik';
import { faRotateRight, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



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





export type UseStateUndefined<S> = [S | undefined, react.Dispatch<react.SetStateAction<S | undefined>>];

export type UseState<S> = [S, react.Dispatch<react.SetStateAction<S>>];

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
  const [messages, setMessages] = React.useState(dummyMessages);
  // const totalMessages = messages.length

  // TODO calculate number of valid messages, win condition, etc
  // setMessages(dummyMessages);

  const renderedMessages = (
    messages.map((message) => { 
      const mystyle = message.messageType === MessageType.User ? styles.bubbleright : styles.bubbleleft;
      return <li key={message.index}><div className={mystyle}>{message.content}</div></li>
    })
  );

  const resetMessages = () => {
    setMessages(dummyMessages);
  };
  const reportIssue = () => {
      alert(`A report has been sent to our engineering team, we'll take a look.`);
  };


  const maxlength = 30;

  const validate = (values: any) => {
    const errors = {};
    if (values.humanInput.length > maxlength) {
      errors.humanInput = `Must be ${maxlength} characters or less.`;
    }
    if (values.humanInput.length == 0) {
      errors.humanInput = "Cannot submit an empty prompt.";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      humanInput: '',
    },
    validate,
    onSubmit: (values, actions) => {
      console.log(`Received ${values}`);
      const newMessage: Message = {
        messageType: MessageType.User,
        index: messages.length,
        rawContent: "",
        content: values.humanInput,
      };
      setMessages(messages.concat(newMessage));
      actions.resetForm()
    },
  });


  return (
    <div className="flex flex-col justify-center place-content-center align-center">
      
      <div className="m-5 sm:m-auto p-3 outline outline-2 outline-slate-200 rounded-lg sm:max-w-[50%] lg:w-96">
        <ul className="flex flex-col">
          {renderedMessages}
        </ul>
      </div>

      {/* <h2>Hello! so far there are {totalMessages} total messages</h2> */}
      
      <form onSubmit={formik.handleSubmit} className="m-4 flex place-content-center">
        {/* <label htmlFor="email">Email Address</label> */}
        {/* <label htmlFor="humanInput" className="block text-center text-gray-700 text-sm font-bold mb-2">
          Ask yes/no question here:
        </label> */}
        <input
          // max-w-[70%]
          autocomplete="off" // https://gist.github.com/niksumeiko/360164708c3b326bd1c8
          className="w-full max-w-xs shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="humanInput"
          name="humanInput"
          // type="email"
          onChange={formik.handleChange}
          value={formik.values.humanInput}
          minlength="1"
          maxlength={maxlength}
          // disabled={formik.isSubmitting}
          // autoFocus
        />
  
        <button type="submit"
          disabled={!formik.isValid}
          className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-200">
          Submit</button>
          {/* <FontAwesomeIcon icon={faArrowUp}/> */}
        
        {/* <div className="block">{formik.errors.humanInput}</div> */}

      </form>

      {/* <button onClick={resetMessages} className="bg-slate-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        <FontAwesomeIcon icon={faRotateRight} className="fa-fw"/>
        Reset</button> */}

      {/* <button onClick={reportIssue} className="bg-red-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Report issue</button> */}

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

      {/* <NavBar /> */}

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