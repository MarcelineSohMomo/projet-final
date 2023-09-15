import React, { Fragment, useState } from 'react';
import { Button, FormControl, Container, Row, Col } from 'react-bootstrap';
import Message from './Message';

const Messages = ({ messages, editMessage, createMessage, deleteMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    createMessage(newMessage);
    setNewMessage('');
  };
  const sortedMessages = [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  return (
    <Fragment>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', height: '100%' }}>
      {sortedMessages.map((message, index) => (
        <Message
          key={index}
          message={message}
          editMessage={editMessage}
          deleteMessage={deleteMessage}
        />
      ))}
      
      </div>
      <div className="d-flex align-items-center">
        <FormControl
          className="mr-2 flex-grow-1"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Ecrire un message..."
        />
        <Button onClick={handleSend}>Envoyer</Button>
      </div>

    </Fragment>
  );
};


export default Messages;
