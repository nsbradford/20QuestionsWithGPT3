import { faArrowUp, faBell, faRotateRight, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import React, { Fragment, useCallback } from 'react';
import styles from '../styles/Home.module.scss';
import typingIndicatorStyles from '../styles/TypingIndicator.module.scss';
import { ModalTailwindUI } from './Modal';
import { dummyMessages, Message, MessageType } from './Utils';

export function Game() {
  const [messages, setMessages] = React.useState([]);
  const [waiting, setWaiting] = React.useState(true);
  // TODO ideally we would keep answer on the server and tie it to user session
  const [answer, setAnswer] = React.useState();
  const questionsAsked = messages.filter((m: Message) => m.messageType == MessageType.User)
  const isStub: boolean = true;
  const [showModal, setShowModal] = React.useState(false);

  // Always auto-scroll to bottom on every re-render
  // https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  const bottomMessagesRef = React.useRef(null);
  React.useEffect(() => {
    bottomMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  // const totalMessages = messages.length
  // TODO calculate number of valid messages, win condition, etc
  // setMessages(dummyMessages);
  const renderedMessages = messages.map((message: Message) => {
    const mystyle =
      message.messageType === MessageType.User ? styles.bubbleright : styles.bubbleleft;
    return (
      <li key={message.index}>
        <div className={mystyle}>{message.content}</div>
      </li>
    );
  });

  const resetMessages = () => {
    setMessages([]);
  };
  const reportIssue = () => {
    alert(`A report has been sent to our engineering team, we'll take a look.`);
  };
  const showDownloadTranscript = () => {
    const totalText = messages.map((message: Message) => message.rawContent).join('\n')
    console.log(totalText);
    // alert(`Check console log.`);

    const rendered = messages.map((message: Message) => {
    return <Fragment key={message.index}>{message.rawContent}<br /></Fragment>
    });
    return rendered
  }
  // https://kevinsimper.medium.com/react-newline-to-break-nl2br-a1c240ba746#.l9sbqp5aw
  const rawTranscript = () => {
    return messages.map((message: Message) => message.rawContent).join('\n')
  }

  const maxlength = 35;

  const validate = (values: any) => {
    const errors = {};
    if (values.humanInput.length > maxlength) {
      errors.humanInput = `Must be ${maxlength} characters or less.`;
    }
    if (values.humanInput.length == 0) {
      errors.humanInput = 'Cannot submit an empty prompt.';
    }
    return errors;
  };

  // https://stackoverflow.com/questions/68684123/why-does-setstate-callback-throw-an-error-state-updates-from-the-usestate-an
  React.useEffect(() => {
    if (!messages.length) {
      sendMessageToServer();
    }
    else if (messages.at(-1)?.messageType == MessageType.User) {
      sendMessageToServer();
    }
  }, [messages]);

  const filterRawResponseData = (raw: string) => {
    return raw.replace('Banter: ', '').replace('Answerer: ', '');
  };

  const sendMessageToServer = useCallback(async () => {
    console.log(`# of messages: ${messages.length}`);
    setWaiting(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: messages, answer: answer, isStub: isStub }),
    });
    const data = await response.json();
    console.log('Received response:')
    console.log(data)
    const newMessage: Message = {
      messageType: MessageType.GPT3,
      index: messages.length,
      rawContent: data.result,
      content: filterRawResponseData(data.result),
    };
    
    // only need to update answer on the first message
    if (answer === undefined) setAnswer(data.answer);

    setMessages(messages.concat(newMessage));
    console.log(`Set new message: ${newMessage.rawContent}`);
    setWaiting(false);
  }, [messages]);

  const formik = useFormik({
    initialValues: {
      humanInput: '',
    },
    validate,
    onSubmit: (values, actions) => {
      console.log(`Received humanInput: ${values.humanInput}`);
      const newMessage: Message = {
        messageType: MessageType.User,
        index: messages.length,
        rawContent: 'Questioner: ' + values.humanInput,
        content: values.humanInput,
      };

      setMessages(messages.concat(newMessage));
      console.log(`Set new message: ${newMessage.rawContent}`);
      actions.resetForm();
    },
  });

  return (
    <div className="flex flex-col justify-center place-content-center align-center">
      <div className="mx-5 my-10 sm:mx-auto sm:max-w-[50%] lg:w-96 p-2 outline outline-2 outline-slate-200 rounded-lg ">
        {/* <div className="text-xs italic ">GPT-3 has entered the chat.</div> */}
        <ul className="flex flex-col">{renderedMessages}</ul>
        {waiting && (
          // https://jsfiddle.net/Arlina/gtttgo93/
          <div className={`${typingIndicatorStyles.typingindicator} m-1`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

<form onSubmit={formik.handleSubmit} className="m-4 mt-10 flex place-content-center">
        {/* <label htmlFor="humanInput" className="block text-center text-gray-600 text-sm font-bold mb-2">
              Ask yes/no question here:
            </label> */}
        <input
          // max-w-[70%]
          autoComplete="off" // https://gist.github.com/niksumeiko/360164708c3b326bd1c8
          className="w-full max-w-xs shadow appearance-none border rounded  py-2 px-3 mx-1 text-gray-600 leading-tight focus:outline-none focus:shadow-lg"
          id="humanInput "
            name="humanInput"
            placeholder="ask questions here"
          // type="email"
          onChange={formik.handleChange}
          value={formik.values.humanInput}
          // minLength="1"
          maxLength={maxlength}
        />

        <button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || waiting}
          className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none disabled:bg-slate-200 shadow focus:shadow-lg">
          {/* <i className="fa-solid fa-arrow-up fa-fw"></i> */}
          <FontAwesomeIcon icon={faArrowUp} /* size="sm" fixedWidth */ className="text-base" />
        </button>

        {/* <div className="block">{formik.errors.humanInput}</div> */}
      </form>

      </div>



      <div className="flex flex-col m-5 my-10 sm:mx-auto sm:max-w-[50%] lg:w-96 ">
        <div className="basis-1/3">
        <button
          onClick={resetMessages}
          className="my-1 bg-slate-300 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          <FontAwesomeIcon icon={faRotateRight} className="fa-fw" />
          Reset
        </button>
        </div>
        <div className="basis-1/3">
          <button onClick={reportIssue} className="my-1 bg-slate-300 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          <FontAwesomeIcon icon={faBell} className="fa-fw" />

            Report issue</button>
        </div>
        <div className="basis-1/3">
          <button onClick={() => setShowModal(true)} className="my-1 bg-slate-300 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          <FontAwesomeIcon icon={faFileDownload} className="fa-fw" />

            Download transcript</button>
        </div>

      </div>

      {showModal && <ModalTailwindUI setShowModal={setShowModal} contents={showDownloadTranscript()} rawContents={rawTranscript()} />}


      {/* {waiting && "Waiting for API response..."} */}
      <div className="h-16" ref={bottomMessagesRef}></div>
    </div>
  );
}
