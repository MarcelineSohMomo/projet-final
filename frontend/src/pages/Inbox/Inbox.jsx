import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Fragment } from 'react'
import { Button, Card, Col, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap'
import { Navigate, useParams } from 'react-router-dom'
import api from '../../api'
import CustomNavbar from '../../components/CustomNavbar/CustomNavbar'
import Loading from '../../components/loading/Loading'
import ServerMessage from '../../components/serverMessage/ServerMessage'
import { toCapitalize } from '../../components/toCapitalize/ToCapitalize'
import { getToken, getUser } from '../../util'
import './inbox.scss';
import Notification from '../../components/Notification/Notification'

const Inbox = () => {
  const [members, setMembers] = useState([]);
  const [Othersmembers, setOthersMembers] = useState([]);
  const [showloading, setShowLoading] = useState(false);
  const [sending, setSending] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [newText, setNewText] = useState("");
  const [saveNewMessage, setSaveNewMessage] = useState(null);
  const [clickedMemberId, setClickedMemberId] = useState(null);

  const { id, name } = useParams();

  const isconnected =  localStorage.getItem("isconnected");
  const token = getToken();
  const userID = getUser()._id;
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userID
    },
  }
  const currentUserId = userID;
  const getConversation = async()=>{
    const res = await api.getConversations(header)
    console.log("res ::", res)
    setConversations(res.data);
    return res.data
  }
  useEffect(() => {
    if (!isconnected) return Navigate('/signin');
    getConversation();
    if(id){
      finduser()
    }
    getUsersAndNotification();
  }, [ selectedMember, clickedMemberId, sending]);

  const finduser = async()=>{
    setShowLoading(true);
    try {
      await api.getProvider_Moderateur_Admin(header)
      .then(res => {
        console.log("res.data ", res.data)
        setMembers(res.data);
      })
      setShowLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  const getUsersAndNotification = async()=>{
    setShowLoading(true);
    try {
      await api.getProvider_Moderateur_Admin(header)
      .then(res => {
        console.log("res.data ", res.data)
        setOthersMembers(res.data);

      })
      setShowLoading(false);
    } catch (error) {
      console.log(error)
    }
  }
  

  const startConversation = async (member) => {
    setSelectedMember(member);
    console.log(member._id);
    if(!member) return null;
    try {
      const response = await api.createConversation({
          participant1Id: userID,
          participant2Id: member._id 
        },
        header
      );
      console.log("response  ::::::", response.data)
      setCurrentConversation(response.data);
      setConversationId(response.data._id)
      return response.data._id
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      console.log(error);
    }
  };

  const createMessage = async (text, conversationId) => {
    console.log(text, conversationId)
    try {
      const response = await api.createMessage(
          { text: text, sender: userID, conversationId: conversationId },
          header
        );
      setServerMessage({ message: "Message envoyé", type: 'success' });
      setNewText("");
      return response.data;
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      console.log(error);
    }
  }
  const sendMessage = async () => {
    setSending(true);
    if (selectedMember && newText !== '') {
      try {
        const responseConversationId =  await startConversation(selectedMember);
        if (currentConversation !== null) {
          const newmessage = await createMessage(newText, responseConversationId);
          const findUpdated =  findAndUpdateCurrentConversation(responseConversationId, newmessage);
          setCurrentConversation(findUpdated);
          setSaveNewMessage(newmessage)
        }
        console.log(" Current conversation : ", currentConversation)
        if(!currentConversation.messages){
          let res = false
          conversations.map(item => {
            console.log(item._id === currentConversation._id)
            if(item._id === currentConversation._id){
              setCurrentConversation(item)
              res = true;
            }
          })
          if(!res){
            let answer = await getConversation()
            answer.map(item => {
              console.log(item._id === currentConversation._id)
              if(item._id === currentConversation._id){
                setCurrentConversation(item)
                res = true;
              }
            })
          }
        }
      } catch (error) {
        console.log(error);
      }finally{
        setSending(false);
      }
    }
  };
  
  const findAndUpdateCurrentConversation = (conversationId, newmessage) => {
    let updatedCurrentConversation = null;
    const updatedConversations = conversations.map(conversation => {
      if (conversation._id === conversationId) {
        updatedCurrentConversation = {
          ...conversation,
          messages: [...conversation.messages, newmessage]
        };
        return updatedCurrentConversation;
      } else {
        return conversation;
      }
    });
    

    setCurrentConversation(updatedCurrentConversation);
    return updatedCurrentConversation;
  }
  const conversationsToDisplay = conversations.filter(conversation => 
    {
      if(selectedMember)
        return conversation.conversationId.participants[0] === selectedMember._id ||
        conversation.conversationId.participants[1] === selectedMember._id
    }
  );

  const findConversation = (id) => {
    return conversations.find(item => item._id === id)
  }

  console.log(Othersmembers);
  return (
    <Fragment>
      <CustomNavbar removeStyle={true} clickedMemberId={clickedMemberId}  />
      <Row >
        <Col md={2} className="" style={{backgroundColor:'#f1f1f9'}}>
          <h4>Discussion</h4>
          <Row onClick={() => { startConversation({_id: id}); setClickedMemberId(id) }}>
            {name && name.toUpperCase() }

            {
              (showloading && members.length == 0) ? <Loading /> : 
              <Col className='m-0 p-0'>
                <ul className='members'>
                  {
                    Othersmembers.length !=0 && Othersmembers.map((member, key) => {
                      console.log("member : ", member)
                      return <li
                        key={member._id}
                        onClick={() => { startConversation(member); setClickedMemberId(member._id) }}
                        className={member._id === clickedMemberId ? 'clicked between' : 'between'}
                      >
                        {member.firstname} {member.unreadCount != 0 && <span>{ member.unreadCount} </span>}
                      </li>
                    }
                    )
                  }
                </ul>
              </Col>
            }
          </Row>
          
          <Row>
            <button className='find-presta' onClick={finduser}>Trouver des prestataires</button>
          </Row>
          <Row>
            {
              (showloading && members.length == 0) ? <Loading /> : 
              <Col className='m-0 p-0'>
                <ul className='members'>
                  {
                    members.map((member, key) =>{
                      return <li
                        key={member._id}
                        onClick={() => { startConversation(member); setClickedMemberId(member._id) }}
                        className={member._id === clickedMemberId ? 'clicked between' : 'between'}
                      >
                        {member.firstname} {member.unreadCount != 0 && <span>{ member.unreadCount} </span>} <span className='rounded bg-white px-1'>  <Notification clickedMemberId={clickedMemberId} /></span>
                      </li>
                    })
                  }
                </ul>
              </Col>
            }
          </Row>
        </Col>
        <Col md={10} className=" d-flex flex-column grow-1" style={{height:"88vh",  overflowY:"hidden"}}>
          <Row className='flex grow-1'> Chat avec {selectedMember && selectedMember.firstname} </Row>
          <Row style={{height:"480px", overflowY:"scroll"}} className='flex grow-1 justify-content-center'> 
            {
              sending ? <Loading /> : 
              <Row>
                {
                  currentConversation && conversations.length !==0 && findConversation(currentConversation._id) && findConversation(currentConversation._id).messages.map((message, key)=>{
                    return (
                      <Row key={key} className={`justify-content-${message.sender === userID ? 'end' : 'start'}`}>
                        <Col xs={6}>
                          <div 
                            className={`my-message ${message.sender === userID ? '' : 'other-message'}`}
                          >
                            <div className='row p-2 justify-content-start'>
                            {message.text}
                            </div>
                            <div>
                              <small className="text-muted">
                                Envoyé le : {new Date(message.createdAt).toLocaleString()}
                              </small>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )
                  })
                }
              </Row>
              }
            
            {serverMessage &&
              <ServerMessage message={serverMessage.message} messageType={serverMessage.type} />
            }
          </Row>
          <Row className='mt-auto py-4'>
            <InputGroup style={{margin:0}}>
              <Form.Control
                placeholder="Ecris un message"
                aria-label="addons"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="formulaire"
              />
              <Button variant="outline-success" onClick={sendMessage}>Envoyer</Button>
            </InputGroup>
          </Row>
        </Col>
      </Row>
    </Fragment>
  ) 
}

export default Inbox