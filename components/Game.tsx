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
  isGameWon,
  Message,
  MessageType,
  reportIssue,
  RequestPayload,
  ResponsePayload,
  TypingIndicator,
} from './Utils';

export function getHelperText(gameState, questionsAsked, questionsLimit) {
  if (gameState == GameState.Won) {
    return `You won against GPT-3!`; // in ${questionsAsked}/${questionsLimit} questions! Congrats on proving humanity's sovereignty over machines.`
  } else if (gameState == GameState.Lost) {
    return `You lost against GPT-3!`; // after ${questionsAsked} questions. Good luck resisting the machine uprising.`
  } else {
    return `You have asked ${questionsAsked}/${questionsLimit} questions.`;
  }
}

export function Game() {
  const [messages, setMessages] = React.useState([]);
  const [waiting, setWaiting] = React.useState(true);
  const [gameState, setGameState] = React.useState(GameState.NotStarted);
  const [showModal, setShowModal] = React.useState(false);
  const [answer, setAnswer] = React.useState(); // shortcut, ideally we would keep answer on the server

  // constants
  const questionsLimit = 20;
  const maxlength = 35;

  // derived
  const isStub: boolean = true;
  const gameOver: boolean = isEnded(gameState);
  const questionsAsked = messages.filter((m: Message) => m.messageType == MessageType.User).length;
  const helperText: string = getHelperText(gameState, questionsAsked, questionsLimit);

  // Auto-scroll to bottom https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  const bottomMessagesRef = React.useRef(null);
  React.useEffect(() => {
    bottomMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  // Make request when user appends a new message.
  // https://stackoverflow.com/questions/68684123/why-does-setstate-callback-throw-an-error-state-updates-from-the-usestate-an
  React.useEffect(() => {
    if (!messages.length || messages.at(-1)?.messageType == MessageType.User) {
      sendMessageToServer();
    }
  }, [messages]);

  const resetGame = () => {
    setMessages([]);
    setGameState(GameState.NotStarted);
  };

  const sendMessageToServer = useCallback(async () => {
    setWaiting(true);
    const payload: RequestPayload = {
      messages: messages,
      answer: answer,
      isStub: isStub,
    };
    const response: Response = await fetchResponseFromAPI(payload);
    const data: ResponsePayload = await response.json();
    const newMessage: Message = {
      messageType: MessageType.GPT3,
      index: messages.length,
      rawContent: data.result,
      content: data.result.replace('Banter: ', '').replace('Answerer: ', ''),
    };
    if (answer === undefined) setAnswer(data.answer);
    setMessages(messages.concat(newMessage));

    if (isGameWon(newMessage)) {
      setGameState(GameState.Won);
    } else if (questionsAsked >= questionsLimit) {
      setGameState(GameState.Lost);
    }

    setWaiting(false);
  }, [messages]);

  return (
    <div className="flex flex-col justify-center place-content-center align-center">
      <div className="mx-5 mt-10 mb-2 sm:mx-auto sm:max-w-[50%] lg:w-96 p-2 outline outline-2 outline-slate-200 rounded-lg ">
        <div className={styles.littletext}>GPT-3 has entered the chat.</div>
        <Messages messages={messages} />
        {waiting && <TypingIndicator />}
        <br />
        {gameOver && (
          <div className={styles.littletext}>
            <br />
            <b>{helperText}</b>
          </div>
        )}
        {gameOver && (
          <div className={styles.littletext}>
            To play again, click&nbsp;<b>Reset</b>&nbsp;below.
          </div>
        )}

        <InputForm
          messages={messages}
          setMessages={setMessages}
          maxlength={maxlength}
          waiting={waiting}
          gameOver={gameOver}
        />
      </div>

      <div
        className={
          styles.littletext
        }>{`You have asked ${questionsAsked}/${questionsLimit} questions.`}</div>

      <div className="flex flex-col m-5 my-10 sm:mx-auto sm:max-w-[50%] lg:w-96 ">
        <div className="basis-1/3">
          <button onClick={resetGame} className={styles.utilbutton}>
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

export function HelperText({ text }: { text: string }) {
  return <div className={styles.littletext}>GAME OVER</div>;
}
