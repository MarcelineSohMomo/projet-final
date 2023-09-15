import React from 'react';
import { ListGroup } from 'react-bootstrap';
import ServiceCardForNote from '../service/ServiceCardForNote';
import ReactStars from "react-rating-stars-component";

const Note = ({ note }) => {
  return (
    <ListGroup.Item>
        <>
          <ReactStars
            count={5}
            value={note.value}
            size={34}
            activeColor="#ffd700"
            isHalf={true}
            edit={false}
          />
          <ServiceCardForNote service={note.serviceId}/>
        </>
    </ListGroup.Item>
  )
};

export default Note;
