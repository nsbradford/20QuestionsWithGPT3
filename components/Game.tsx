import { faBell, faFileDownload, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';
import styles from '../styles/Home.module.scss';
import { InputForm } from './InputForm';
import { Messages } from './Messages';
import { MyModal } from './MyModal';
import {
  dummyMessages,
  fetchResponseFromAPI,
  GameState,
  isEnded,
  Message,
  MessageType,
  TypingIndicator,
} from './Utils';

export function Game() {
  const [messages, setMessages] = React.useState([]);
  const [waiting, setWaiting] = React.useState(true);
  const [gameState, setGameState] = React.useState(GameState.NotStarted);
  const [showModal, setShowModal] = React.useState(false);
  const [answer, setAnswer] = React.useState(); // shortcut, ideally we would keep answer on the server

  // derived
  const isStub: boolean = true;
  const gameOver: boolean = isEnded(gameState);
  const questionsAsked = messages.filter((m: Message) => m.messageType == MessageType.User).length;
  const blockInput = waiting || gameOver;

  // constants
  const questionsLimit = 2;
  const maxlength = 35;

  // Auto-scroll to bottom https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  const bottomMessagesRef = React.useRef(null);
  React.useEffect(() => {
    bottomMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  const reportIssue = () => {
    alert(`A report has been sent to our engineering team, we'll take a look.`);
  };

  // https://stackoverflow.com/questions/68684123/why-does-setstate-callback-throw-an-error-state-updates-from-the-usestate-an
  React.useEffect(() => {
    if (!messages.length || messages.at(-1)?.messageType == MessageType.User) {
      sendMessageToServer();
    }
    // TODO
    // if (questionsAsked > questionsLimit) {
    //   alert("Game over, you lose!")
    // }
  }, [messages]);

  const sendMessageToServer = useCallback(async () => {
    console.log(`# of messages: ${messages.length}`);
    setWaiting(true);
    const response: Response = await fetchResponseFromAPI(messages, answer, isStub);
    const data: any = await response.json();
    const newMessage: Message = {
      messageType: MessageType.GPT3,
      index: messages.length,
      rawContent: data.result,
      content: data.result.replace('Banter: ', '').replace('Answerer: ', ''),
    };
    if (answer === undefined) setAnswer(data.answer);
    setMessages(messages.concat(newMessage));
    setWaiting(false);
  }, [messages]);

  return (
    <div className="flex flex-col justify-center place-content-center align-center">
      <div className="mx-5 mt-10 mb-2 sm:mx-auto sm:max-w-[50%] lg:w-96 p-2 outline outline-2 outline-slate-200 rounded-lg ">
        <div className={styles.littletext}>GPT-3 has entered the chat.</div>
        <Messages messages={messages} />
        {waiting && <TypingIndicator />}
        <InputForm
          messages={messages}
          setMessages={setMessages}
          maxlength={maxlength}
          blockInput={blockInput}
        />
      </div>

      <div className={styles.littletext}>
        You have asked {questionsAsked}/{questionsLimit} questions.
      </div>

      <div className="flex flex-col m-5 my-10 sm:mx-auto sm:max-w-[50%] lg:w-96 ">
        <div className="basis-1/3">
          <button onClick={() => setMessages([])} className={styles.utilbutton}>
            <FontAwesomeIcon icon={faRotateRight} className="fa-fw" />
            Reset
          </button>
        </div>
        <div className="basis-1/3">
          <button onClick={reportIssue} className={styles.utilbutton}>
            <FontAwesomeIcon icon={faBell} className="fa-fw" />
            Report issue
          </button>
        </div>
        <div className="basis-1/3">
          <button onClick={() => setShowModal(true)} className={styles.utilbutton}>
            <FontAwesomeIcon icon={faFileDownload} className="fa-fw" />
            Download transcript
          </button>
        </div>
      </div>

      {showModal && <MyModal messages={messages} setShowModal={setShowModal} />}
      <div className="h-16" ref={bottomMessagesRef}></div>
    </div>
  );
}
