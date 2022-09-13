import React from 'react';
import styles from '../styles/Home.module.scss';
import { Message, MessageType } from './Utils';

export function Messages({ messages }: { messages: Message[] }) {
  const renderedMessages = messages.map((message: Message) => {
    const mystyle =
      message.messageType === MessageType.User ? styles.bubbleright : styles.bubbleleft;
    return (
      <li key={message.index}>
        <div className={mystyle}>{message.content}</div>
      </li>
    );
  });

  return <ul className="flex flex-col">{renderedMessages}</ul>;
}
