import React, { useState } from 'react';
import { Button, Col, FormControl, Row } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Message = ({ message, editMessage, deleteMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.text);

  const handleSave = () => {
    editMessage(editedMessage, message._id);
    setIsEditing(false);
  };

  console.log("editedMessage ", editedMessage)
  return (
    <Row className="my-2">
      {isEditing ? (
        <Col>
          <FormControl
            value={editedMessage}
            onChange={e => setEditedMessage(e.target.value)}
          />
          <Button onClick={handleSave}>Save</Button>
        </Col>
      ) : (
        <Col>
          {message.text}
          <FaEdit  className="mx-2" onClick={() => setIsEditing(true)}/>
          <FaTrash className="mx-2"  onClick={() => deleteMessage(message)}/>
        </Col>
      )}
    </Row>
  );
};

export default Message;
