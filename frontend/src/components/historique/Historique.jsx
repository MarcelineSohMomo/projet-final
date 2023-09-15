import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Col, Row, Card } from 'react-bootstrap';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../api';
import { getToken, getUser } from '../../util';
import DiscussionInterface from '../discussionList/DiscussionInterface';
import ServerMessage from '../serverMessage/ServerMessage';
import CommandeForHist from './CommandeForHist';

const Historique = ({ commande }) => {
  const [showModal, setShowModal] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('');
  const [serverMessage, setServerMessage] = useState(null);
  const header = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      id: getUser()._id
    }
  };
  const [editing, setEditing] = useState(null);

  const handleEditComment = (commentId, commentText) => {
    setEditing({ id: commentId, text: commentText });
  };

  const fetchComments = async () => {
    try {
      const res = await api.getPrivateComments(header);
      setComments(res.data);
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

  const handleOpenModal = async () => {
    setShowModal(true);
    try {
      // const res = await api.getDiscussion({
      //   userId1: auth.userData.user._id,
      //   userId2: commande.providerId
      // }, header)
      // setDiscussions(res.data);
    } catch(error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddComment = async () => {
    try {
      const response = await api.postComment({
        commenterId: getUser()._id,
        serviceId: commande.serviceId,
        text: newComment,
        private: true
      }, header);
      setServerMessage({ message: 'Commentaire ajouté avec succès', type: 'success' });
      setComments([...comments, response.data]);
      setNewComment('');
      setShowModal(false);
    } catch (error) {
      setServerMessage({ message: 'Erreur lors de l\'ajout du commentaire', type: 'error' });
    }
  };

  const handleUpdateComment = async () => {
    try {
      await api.updateComment(editing, header);
      setServerMessage({ message: 'Commentaire mis à jour avec succès', type: 'success' });
      setEditing(null);
      fetchComments();
    } catch (error) {
      setServerMessage({ message: 'Erreur lors de la mise à jour du commentaire', type: 'error' });
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire?')) {
      try {
        await api.deleteComment({
          headers: {
            Authorization: `Bearer ${getToken()}`,
            id: commentId
          },
        });
        fetchComments();
      } catch (error) {
          setServerMessage({ message: 'Erreur lors de la suppression du commentaire', type: 'error' });
        }
      }
    };

    return (
      <Row className='justify-content-between'>
        {serverMessage &&
          <ServerMessage message={serverMessage.message} messageType={serverMessage.type} />
        }
        <Col xs={12} md={3} className="m-1" >
          <div>
            <CommandeForHist commande={commande} />
          </div>
          <Button onClick={handleOpenModal}>Laisser une note</Button>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Échanges</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Ajouter un commentaire</Form.Label>
                  <Form.Control as="textarea" rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                </Form.Group>
              </Form>
              {/* <DiscussionInterface discussions={discussions}  /> */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Fermer
              </Button>
              <Button variant="primary" className='mx-2' onClick={handleAddComment}>
                Ajouter
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
        <Col xs={12} md={8} className="p-1">
          <Card>
            {comments.map((comment) => (
              <Row key={comment._id}>
                <Col md={12} >
                  <Card.Body>
                    {editing && editing.id === comment._id ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={editing.text}
                        onChange={e => setEditing({ ...editing, text: e.target.value })}
                      />
                    ) : (
                      <Card.Text>{comment.text}</Card.Text>
                    )}
                    <div>
                      {editing && editing.id === comment._id ? (
                        <Button variant='primary' onClick={handleUpdateComment}><FaCheck/> Appliquer</Button>
                      ) : (
                        <FaEdit onClick={() => handleEditComment(comment._id, comment.text)} />
                      )}
                      <FaTrash onClick={() => handleDeleteComment(comment._id)} />
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            ))}
          </Card>
        </Col>
      </Row>
    )
}

export default Historique
