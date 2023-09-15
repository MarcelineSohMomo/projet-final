import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import api from '../../api';
import { getToken, getUser } from '../../util';
import ServerMessage from '../serverMessage/ServerMessage';
import Comment from './Comment';

const CommentsList = ({ listcomments, serviceId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [serverMessage, setServerMessage] = useState(null); 
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const token = getToken();

  useEffect(() => {
    const fetchComments = async () => {
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const res = await api.getCommentsByIds({ids: listcomments}, header);
        setComments(res.data);
      } catch (error) {
        const resolvedError = error.response;
        setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
        setServerMessageKey(prevKey => prevKey + 1);
      }
    }
    fetchComments();
  }, [listcomments, token]);

  const handleNewCommentSubmit = async () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.postComment({
        text: newComment,
        serviceId: serviceId,
        commenterId: getUser()._id
      }, header);
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      setServerMessageKey(prevKey => prevKey + 1);
    }
  };

  const handleCommentUpdate = (commentId, updatedComment) => {
    const updatedComments = comments.map(comment => 
      comment._id === commentId ? updatedComment : comment
    );
    setComments(updatedComments);
  };

  const handleCommentDelete = (commentId) => {
    const updatedComments = comments.filter(comment => comment._id !== commentId);
    setComments(updatedComments);
  };

  return (
    <Container>
      {serverMessage && (
        <ServerMessage
          message={serverMessage.message}
          type={serverMessage.type}
        />
      )}
      <Row>
        <Col md={6} >
          <Form>
            <Form.Group controlId="newComment">
              <Form.Control as="textarea" rows={3} placeholder="Nouveau commentaire" value={newComment} onChange={e => setNewComment(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={handleNewCommentSubmit}>
              Ajouter
            </Button>
          </Form>
        </Col>
      </Row>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onUpdate={handleCommentUpdate}
          onDelete={handleCommentDelete}
        />
      ))}
    </Container>
  );
};

export default CommentsList;
