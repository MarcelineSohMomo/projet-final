import React from 'react';
import { ListGroup } from 'react-bootstrap';

const DiscussionList = ({ discussions, selectDiscussion }) => {
  return (
    <ListGroup>
      {discussions.map((discussion, index) => (
        <ListGroup.Item 
          key={index} 
          action 
          onClick={() => selectDiscussion(discussion)}
        >
          Discussion {index + 1}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default DiscussionList;
