// src/components/Comments.js

import React, { useState } from 'react';
import { Button, ListGroup, FormControl } from 'react-bootstrap';

const Comments = ({ initialComments, onUpdateComment, onDeleteComment }) => {
  const [comments, setComments] = useState(initialComments);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

  const handleUpdateComment = (index) => {
    onUpdateComment(index, editedCommentText);
    setEditingComment(null);
  };

  const handleDeleteComment = (index) => {
    onDeleteComment(index);
  };

  return (
    <div>
      <h3>Commentaires</h3>
      <ListGroup>
        {comments.map((comment, index) => (
          <ListGroup.Item key={index}>
            {editingComment === index ? (
              <>
                <FormControl
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                />
                <Button onClick={() => handleUpdateComment(index)}>Mettre à jour</Button>
              </>
            ) : (
              <>
                {comment}
                <Button onClick={() => setEditingComment(index)}>Modifier</Button>
                <Button onClick={() => handleDeleteComment(index)}>Supprimer</Button>
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Comments;
