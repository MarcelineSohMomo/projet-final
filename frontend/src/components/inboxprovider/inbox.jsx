import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../api';
import DiscussionInterface from '../../components/discussionList/DiscussionInterface';
import Loading from '../../components/loading/Loading';
import ServerMessage from '../../components/serverMessage/ServerMessage';
import AuthGuard from '../../components/VerifyAuth/AuthGuard'
import { getToken, getUser } from '../../util';
import CustomNavbar from '../CustomNavbar/CustomNavbar';

const Contacter = () => {
  const [provider, setProvider] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  let { id } = useParams();
    let providerId = id;

  const header = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      id: getUser()._id
    },
  }

  useEffect(() => {
    const getAdminInfo = async() => {
      setIsLoading(true);  // début du chargement
      try {
        createConversation(providerId);
        const discussionsResponse = await api.getConversations(header);
        console.log(discussionsResponse)
        setDiscussions(discussionsResponse.data);
      } catch (error) {
        console.log(error);
        const resolvedError = error.response;
        setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      }
      setIsLoading(false);  // fin du chargement
    }

    getAdminInfo()
  }, [refreshKey]);
  const createConversation = async (adminId) => {
    try {
      const response = await api.createConversation({
          participant1Id: getUser()._id,
          participant2Id: adminId 
        },
        header
      );
      setConversationId(response.data._id);
    } catch (error) {
      console.log(error);
      const resolvedError = error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });

      console.log(error);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await api.createMessage(
          { text: newMessage, sender: getUser()._id, conversationId: conversationId },
          header
        );
      setServerMessage({ message: "Message envoyé", type: 'success' });
      setNewMessage("");
      console.log("Message sent:", response.data);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <AuthGuard>
       <CustomNavbar />
      <Row>
        <Col >
          {isLoading ? (
            <Loading/>
          ) : (
            <DiscussionInterface discussions={discussions} setRefreshKey={setRefreshKey} />
          )}
        </Col>
        <Col >
          {serverMessage &&
            <ServerMessage message={serverMessage.message} messageType={serverMessage.type} />
          }
          {conversationId && discussions.length ===0 ? (
            <div>
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Write a message..." />
              <button onClick={sendMessage}>Send</button>
            </div>
          ) : null}
        </Col>
      </Row>
    </AuthGuard>
  )
}

export default Contacter;
