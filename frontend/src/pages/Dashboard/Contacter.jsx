import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../../api';
import DiscussionInterface from '../../components/discussionList/DiscussionInterface';
import Loading from '../../components/loading/Loading';
import ServerMessage from '../../components/serverMessage/ServerMessage';
import AuthGuard from '../../components/VerifyAuth/AuthGuard'

const Contacter = () => {
  const auth = useSelector(state => state.auth);
  const [admin, setAdmin] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const userID =  localStorage.getItem("_id");
  const token =  localStorage.getItem("token");
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userID
    },
  }

  useEffect(() => {
    const getAdminInfo = async() => {
      setIsLoading(true);  // début du chargement
      try {
        await api.getAdminInfo(header)
        .then(res => {
          setAdmin(res.data);
          createConversation(res.data._id);
        });
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
    getAdminInfo();
  }, [refreshKey]);
  const createConversation = async (adminId) => {
    try {
      const response = await api.createConversation({
          participant1Id: userID,
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
          { text: newMessage, sender: userID, conversationId: conversationId },
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
      <div>
          {serverMessage &&
            <ServerMessage message={serverMessage.message} messageType={serverMessage.type} />
          }
          {conversationId && discussions.length ==0 &&(
            <div>
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Write a message..." />
              <button onClick={sendMessage}>Send</button>
            </div>
          )}
          {isLoading ? (
            <Loading/>
          ) : (
            <DiscussionInterface discussions={discussions} setRefreshKey={setRefreshKey} />
          )}
      </div>
    </AuthGuard>
  )
}

export default Contacter;
