import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import api from '../../api';
import ServerMessage from '../serverMessage/ServerMessage';
import Note from './Note';
import Loading from '../loading/Loading';
import { getToken, getUser } from '../../util';
import SmallNoteCard from '../profil/SmallNoteCard';


const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [serverMessage, setServerMessage] = useState(null); 
  const [serverMessageKey, setServerMessageKey] = useState(0);

  const header = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        id: getUser()._id
      }
  };
 

  useEffect( () => {
    const getNotes = async () => {
      try {
        const res = await api.getNotesByUser(header);
        setNotes(res.data);
      } catch (error) {
        const resolvedError = error.response;
        setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
        setServerMessageKey(prevKey => prevKey + 1);
      }
    }
    getNotes();
  }, []);

  return (
    <Container style={{height:"80vh", overflow:"scroll"}}>
        {
          notes.length !==0
          ?
          <div className='row'>
          <div className='col'>
            {serverMessage && (
              <ServerMessage
                message={serverMessage.message}
                type={serverMessage.type}
              />
            )}
            <h4>Liste des notes</h4>
            {/* <div className='row'>
              {notes && notes.map((note) => (
                <div className="mb-3 col-3">
                  <SmallNoteCard note={note} width={"200px"} height={"180px"} user={note.userId} showservice={true} />
                </div>
                // <div className="col-3 mb-3">
                //   <SmallNoteCard  width={"200px"} height={"180px"} note={note}  user={note.userId} />
                // </div>
            ))}
            </div> */}
             <div class=" row" style={{marginBottom:"8rem"}}>
              {
                notes.map((note, index) =>(
                  
                  <div key={index} className="col-3">
                    <SmallNoteCard showservice={true} user={note.userId} width={"200px"} height={"180px"}  note={note}/>
                  </div>
                ))
              }
            </div>
  
          </div>
        </div>
          :
            // notes.length=== 0 ? <Row> Aucune notes trouvée </Row> : 
            <Loading />
        }
    </Container>
  );
};

export default NotesList;
