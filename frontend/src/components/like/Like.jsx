// src/components/Like.js

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';

const Like = ({ initialLikes, onLike }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    const newLikes = liked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setLiked(!liked);
    onLike(newLikes);
  };

  return (
    <div>
      <p>Total de likes: {likes}</p>
      <Button onClick={handleLike}>
        <FaHeart color={liked ? 'red' : 'gray'} />
      </Button>
    </div>
  );
};

export default Like;
