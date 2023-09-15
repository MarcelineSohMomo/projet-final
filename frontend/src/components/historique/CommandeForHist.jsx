import React, { useState } from 'react';
import { Button, Card, Row, Col, ButtonGroup } from 'react-bootstrap';
import api from '../../api';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa'; // Importing icons
import ServerMessage from '../serverMessage/ServerMessage';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';
import { getToken } from '../../util';


const CommandeForHist = ({ commande }) => {
  const header = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      id: commande._id,
    }
  }
  const [showDialog, setShowDialog] = useState(false);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [serverMessage, setServerMessage] = useState(null);
  const [status, setStatus] = useState(commande.status);
  const [isdelete, setisdelete] = useState(false);
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return '';
    }
  };
  const handleValidate = async (update_status) => {
    setStatus(update_status);
    await api.updateCommande({status: update_status}, header)
    .then(res => {
      setServerMessageKey(prevKey => prevKey + 1);
      setServerMessage({
        message: res.data.message,
        type: 'success',
      });
    })
    .catch(error => {
      const resolvedError = error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      setServerMessageKey(prevKey => prevKey + 1);
      console.log(error);
    })    
  };


  const handleConfirmDelete = async () => {
    await api.deleteCommande(header)
    .then(res => {
      setServerMessageKey(prevKey => prevKey + 1);
      setServerMessage({
        message: res.data.message,
        type: 'success',
      });
      setisdelete(true)
    })
    .catch(error => {
      const resolvedError = error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      setServerMessageKey(prevKey => prevKey + 1);
      console.log(error);
    })  
  };
  const handleDelete = async () => {
    setShowDialog(true);  
  };
  console.log(status)
  return (
    <Col md={3} >
      <ConfirmationDialog
        show={showDialog}
        handleClose={() => setShowDialog(false)}
        handleConfirm={handleConfirmDelete}
        message="Êtes-vous sûr de vouloir supprimer cette commande ?"
      />
    <Card style={{ width: '18rem', marginBottom: '1rem', opacity: isdelete ? '0.7' : '1' }}>
      <Card.Body>
        {serverMessage && (
            <ServerMessage
            message={serverMessage.message}
            type={serverMessage.type}
            key={serverMessageKey}
            />
        )}
        <Card.Title>{commande.name}</Card.Title>
        <Card.Text>
          Service: {commande.serviceId.name}<br/>
          Customer: {commande.customer.firstname}<br/>
          Price: ${commande.price}<br/>
          Status: <span className={`text-white p-2 rounded  ${getStatusColor(status)}`}> {status} </span>
        </Card.Text>
        <Row>
          {/* <UserProfileCard user={commande.customer} /> */}
        </Row>

      </Card.Body>
    </Card>
    </Col>
  );
};

export default CommandeForHist;
