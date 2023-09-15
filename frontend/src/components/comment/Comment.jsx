import React, { useEffect, useState } from 'react';
import { ListGroup, Button, Form, Row, Col } from 'react-bootstrap';
import api from '../../api';
import ServerMessage from '../serverMessage/ServerMessage';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { getToken } from '../../util';


const Comment = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(comment.text);
  const header = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      id: comment._id
    },
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleApplyClick = async() => {
    setIsEditing(false);
    console.log("comment ", comment);
    const updatedCommentData = { ...comment, text: updatedComment };
    try {
      await api.updateComment(updatedCommentData, header);
      onUpdate(comment._id, updatedCommentData);
    } catch (error) {
      console.log("Erreur lors de la mise à jour du commentaire", error);
    }
  };

  const handleDeleteClick = async() => {
    try {
      await api.deleteComment(header);
      onDelete(comment._id);
    } catch (error) {
      console.log("Erreur lors de la suppression du commentaire", error);
    }
  };

  const handleChange = (event) => {
    setUpdatedComment(event.target.value);
  };

  return (
    <ListGroup.Item>
      {isEditing ? (
        <>
          <Form.Control as="textarea" rows={3} name="text" value={updatedComment} onChange={handleChange} />
          <Button variant="success" className="ml-2" onClick={handleApplyClick}>
            <FaCheck />
          </Button>
          <Button variant="danger" className="ml-2" onClick={handleDeleteClick}>
            <FaTrash />
          </Button>
        </>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <CustomComment firstname={comment.commenterId && comment.commenterId.firstname} lastname={comment.commenterId && comment.commenterId.lastname}  img={comment.commenterId && comment.commenterId.img} text={comment.text}/>
            </Col>
            <Col md={4} className="text-right">
              <Button variant="primary" className="ml-2" onClick={handleEditClick}>
                <FaEdit />
              </Button>
              <Button variant="danger" className="m-2" onClick={handleDeleteClick}>
                <FaTrash />
              </Button>
            </Col>
          </Row>
        </>
      )}
    </ListGroup.Item>
  );
};

export default Comment;

const CustomComment = ({img, firstname, lastname, text}) =>{
  return <Row className='rounded my-4'>
    <Col md={2} > 
      <img src={`http://localhost:5000/${img}`} className="rounded-circle" width={50} height={50} alt="profil user" />
    </Col>
    <Col md={9} className="p-3" style={{backgroundColor:"#FFF3F3D3"}}>
      <Row>
        <span style={{fontSize:"1rem"}} className="text-capitalize fs-6 fw-light">{lastname && lastname.toUpperCase()} {firstname}</span>
      </Row>
      <Row className='p-3'> {text} </Row>
    </Col>
  </Row>
}