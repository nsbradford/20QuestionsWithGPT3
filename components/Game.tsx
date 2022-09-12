import { useFormik } from 'formik';
import React, { useCallback } from 'react';
import styles from '../styles/Home.module.scss';
import typingIndicatorStyles from '../styles/TypingIndicator.module.scss'
import { dummyMessages, Message, MessageType } from './Utils';


export function Game() {
  const [messages, setMessages] = React.useState(dummyMessages);
  const [waiting, setWaiting] = React.useState(false);

  // Always auto-scroll to bottom on every re-render
  // https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  const bottomMessagesRef = React.useRef(null);
  React.useEffect(() => {
    bottomMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  // const totalMessages = messages.length
  // TODO calculate number of valid messages, win condition, etc
  // setMessages(dummyMessages);
  const renderedMessages = messages.map(message => {
    const mystyle =
      message.messageType === MessageType.User ? styles.bubbleright : styles.bubbleleft;
    return (
      <li key={message.index}>
        <div className={mystyle}>{message.content}</div>
      </li>
    );
  });

  const resetMessages = () => {
    setMessages(dummyMessages);
  };
  const reportIssue = () => {
    alert(`A report has been sent to our engineering team, we'll take a look.`);
  };

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
    if (messages.at(-1)?.messageType == MessageType.User) {
      sendMessageToServer();  
    }
  }, [messages])

  const filterRawResponseData = (raw: string) => {
    return raw;
  };

  const sendMessageToServer = useCallback(async () => { 
    console.log(`# of messages: ${messages.length}`)
    setWaiting(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messages, isStub: true}),
    });
    const data = await response.json();
    setWaiting(false);
    const newMessage: Message = {
      messageType: MessageType.GPT3,
      index: messages.length,
      rawContent: data.result,
      content: filterRawResponseData(data.result),
    };
    setMessages(messages.concat(newMessage));
    console.log(`Set new message: ${newMessage.rawContent}`)
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
        rawContent: 'Human: ' + values.humanInput,
        content: values.humanInput,
      };

      setMessages(messages.concat(newMessage));
      console.log(`Set new message: ${newMessage.rawContent}`)
      actions.resetForm();
    },
  });

  return (
    <div className="flex flex-col justify-center place-content-center align-center">
      <div className="m-5 sm:m-auto p-3 outline outline-2 outline-slate-200 rounded-lg sm:max-w-[50%] lg:w-96">
        <ul className="flex flex-col">{renderedMessages}</ul>
        {waiting && 
          // https://jsfiddle.net/Arlina/gtttgo93/
          <div className={`${typingIndicatorStyles.typingindicator} m-1`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        }

      </div>

      <form onSubmit={formik.handleSubmit} className="m-4 flex place-content-center">
        {/* <label htmlFor="humanInput" className="block text-center text-gray-700 text-sm font-bold mb-2">
              Ask yes/no question here:
            </label> */}
        <input
          // max-w-[70%]
          autoComplete="off" // https://gist.github.com/niksumeiko/360164708c3b326bd1c8
          className="w-full max-w-xs shadow appearance-none border rounded  py-2 px-3 mx-1 text-gray-700 leading-tight focus:outline-none focus:shadow-lg"
          id="humanInput "
          name="humanInput"
          // type="email"
          onChange={formik.handleChange}
          value={formik.values.humanInput}
          // minLength="1"
          maxLength={maxlength}
        />


        <button
          type="submit"
          disabled={!formik.isValid || !formik.dirty}
          className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none disabled:bg-slate-200 shadow focus:shadow-lg">
          <i className="fa-solid fa-arrow-up fa-fw"></i>
        </button>
        {/* <FontAwesomeIcon icon={faArrowUp}/> */}

        {/* <div className="block">{formik.errors.humanInput}</div> */}
      </form>

      {/* <button onClick={resetMessages} className="bg-slate-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              <FontAwesomeIcon icon={faRotateRight} className="fa-fw"/>
              Reset</button> */}

      {/* <button onClick={reportIssue} className="bg-red-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Report issue</button> */}

      {/* {waiting && "Waiting for API response..."} */}
      <div ref={bottomMessagesRef}></div>
    </div>
  );
}
