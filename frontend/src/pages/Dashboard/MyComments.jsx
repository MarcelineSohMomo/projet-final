import React, { useEffect, useState } from 'react';
import api from '../../api';
import Comment from '../../components/comment/Comment';

const MyComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.getComments();
        setComments(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div>
        <h4>Mes commentaires</h4>
      {comments.map((comment, key) => (
        <Comment key={key} comment={comment} />
      ))}
    </div>
  );
};

export default MyComments;
