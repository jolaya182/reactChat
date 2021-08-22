/**
 * @title: ChatForm.jsx
 * @author: Javier Olaya
 * @date: 8/19/2021
 * @description: main component that sends messages, resets the
 * local storage and message history
 */
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ChatForm = ({ sendMessage, clearHistory, clearLocalStorage }) => {
  const [currentText, setCurrentText] = useState('');

  return (
    <Form
      className="chat-form"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(currentText);
        setCurrentText('');
      }}
    >
      <Form.Group>
        <Form.Control
          type="text"
          onChange={(e) => {
            e.preventDefault();
            setCurrentText(e.target.value);
          }}
          value={currentText}
        ></Form.Control>
        <Button
          onClick={() => {
            sendMessage(currentText);
            setCurrentText('');
          }}
        >
          Send Message
        </Button>
        <Button onClick={clearHistory}>Clear History</Button>
        <Button onClick={clearLocalStorage}>Clear Local Storage</Button>
      </Form.Group>
    </Form>
  );
};
export default ChatForm;
