import React, { Fragment } from 'react';
import { ModalTailwindUI } from './Modal';
import { Message } from './Utils';

export function MyModal({
  messages,
  setShowModal,
}: {
  messages: Message[];
  setShowModal: () => boolean;
}) {
  const showDownloadTranscript = () => {
    const totalText = messages.map((message: Message) => message.rawContent).join('\n');
    console.log(totalText);
    const rendered = messages.map((message: Message) => {
      return (
        <Fragment key={message.index}>
          {message.rawContent}
          <br />
        </Fragment>
      );
    });
    return rendered;
  };

  // https://kevinsimper.medium.com/react-newline-to-break-nl2br-a1c240ba746#.l9sbqp5aw
  const rawTranscript = () => {
    return messages.map((message: Message) => message.rawContent).join('\n');
  };

  return (
    <ModalTailwindUI
      setShowModal={setShowModal}
      contents={showDownloadTranscript()}
      rawContents={rawTranscript()}
    />
  );
}
