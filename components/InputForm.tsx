import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import React from 'react';
import { Message, MessageType } from './Utils';

export function InputForm({
  messages,
  setMessages,
  maxlength,
  blockInput,
}: {
  messages: Message[];
  setMessages: (arg0: any) => void;
  maxlength: number;
  blockInput: boolean;
}) {
  const validate = (values: any) => {
    const errors = {};
    if (values.humanInput.length > maxlength) {
      errors.humanInput = `Must be ${maxlength} characters or less.`;
    } else if (values.humanInput.length == 0) {
      errors.humanInput = 'Cannot submit an empty prompt.';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      humanInput: '',
    },
    validate,
    onSubmit: (values, actions) => {
      const newMessage: Message = {
        messageType: MessageType.User,
        index: messages.length,
        rawContent: 'Questioner: ' + values.humanInput,
        content: values.humanInput,
      };
      setMessages(messages.concat(newMessage));
      actions.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="m-4 mt-10 flex place-content-center">
      <input
        autoComplete="off" // https://gist.github.com/niksumeiko/360164708c3b326bd1c8
        className="w-full max-w-xs shadow appearance-none border rounded  py-2 px-3 mx-1 text-gray-600 leading-tight focus:outline-none focus:shadow-lg"
        id="humanInput "
        name="humanInput"
        placeholder="ask questions here"
        onChange={formik.handleChange}
        value={formik.values.humanInput}
        maxLength={maxlength}
      />

      <button
        type="submit"
        disabled={!formik.isValid || !formik.dirty || blockInput}
        className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-slate-400 disabled:bg-slate-200 shadow">
        <FontAwesomeIcon icon={faArrowUp} className="text-base" />
      </button>

      {/* <div className="block">{formik.errors.humanInput}</div> */}
    </form>
  );
}
