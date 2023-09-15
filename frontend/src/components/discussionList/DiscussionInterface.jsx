import React, { useState } from 'react';
import { Col, Row, Container, Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import api from '../../api';
import Messages from '../messages/Messages';
import DiscussionList from './DiscussionList';

const DiscussionInterface = ({ discussions,  setRefreshKey}) => {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const auth = useSelector(state => state.auth);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const header = {
    headers: {
      Authorization: `Bearer ${auth.userData.token}`,
      id: auth.userData.user._id
    },
  }

  const selectDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  const createMessage = async (content) => {
    const response = await api.createMessage( {
      text: content,
      sender: auth.userData.user._id, 
      conversationId: selectedDiscussion._id
    }, header);
    
    setSelectedDiscussion(prev => ({
      ...prev,
      messages: [...prev.messages, response.data]
    }));
    setRefreshKey(prevKey => prevKey + 1);

  };

  const deleteMessage = async (messageId) => {
    console.log("messageId ", messageId)
    await api.deleteMessage(messageId._id, header);
    setSelectedDiscussion(prev => ({
      ...prev,
      messages: prev.messages.filter(message => message.id !== messageId)
    }));
    setRefreshKey(prevKey => prevKey + 1);
    
  };

  const handleDelete = async () => {
    if (messageToDelete) {

      console.log("messageToDelete ", messageToDelete)
      await api.deleteMessage({ id: messageToDelete }, header);
      setSelectedDiscussion(prev => ({
        ...prev,
        messages: prev.messages.filter(message => message.id !== messageToDelete)
      }));
      setMessageToDelete(null);
      setRefreshKey(prevKey => prevKey + 1);

    }
  };

  const askForDelete = (messageId) => {
    setMessageToDelete(messageId._id);
  };

  const editMessage = async (newText, messageId) => {
    console.log("messageId ", messageId)
    const response = await api.editMessage({ 
      id: messageId, 
      text: newText
    }, header);
    setSelectedDiscussion(prev => ({
      ...prev,
      messages: prev.messages.map(message =>
        message.id === messageId
          ? { ...message, text: response.data.text }
          : message
      )
    }));
  };
  
  console.log(selectedDiscussion);
  return (
    <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Modal show={messageToDelete !== null} onHide={() => setMessageToDelete(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer ce message ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMessageToDelete(null)}>
            Non
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Oui
          </Button>
        </Modal.Footer>
      </Modal>
      <Row style={{ flex: '1', overflow: 'auto' }}>
        <Col sm={4}>
          <DiscussionList
            discussions={discussions}
            selectDiscussion={selectDiscussion}
          />
        </Col>
        <Col sm={8}>
          {selectedDiscussion && (
            <Messages
              messages={selectedDiscussion.messages}
              createMessage={createMessage}
              editMessage={editMessage}
              deleteMessage={askForDelete}
            />
            )}
          </Col>
        </Row>
      </Container>
    );
  };
export default DiscussionInterface;
