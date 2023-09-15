import React from 'react';
import { Card, Button, Image, Carousel } from 'react-bootstrap';
import { toCapitalize } from '../toCapitalize/ToCapitalize';
import { FaHeart } from 'react-icons/fa'; 
import './service.scss';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service, width, height }) => {
  const {
    name,
    description,
    imgs,
    tarification,
    likers,
    providerId: { firstname, lastname, img },
  } = service;
  const profileImg = img ? (
    <Image src={`http://localhost:5000/${img}`} alt="" roundedCircle width={50} height={50} className="profile-img" />
  ) : (
    <div className="empty-profile"></div>
  );

  return (
    <Card className="custom-card">
      <Link to={`/services/${service._id}`}>
        <Carousel>
          {imgs && imgs.length > 0 ? imgs.map((image, index) => 
            <Carousel.Item key={index}>
              <img className="d-block w-100" src={`http://localhost:5000/${image}`} width={width} height={height} alt={`slide ${index}`} />
            </Carousel.Item>
          ) : (
            <div className="no-content" style={{width:width, height:height}}>No Content</div>
          )}
        </Carousel>
      </Link>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        {/* <Card.Text>{description && (description).substring(0,100)+"..."}</Card.Text>
        <Card.Text>Prix de base: {tarification[0].prix} €</Card.Text> */}
        <Card.Text>
          { profileImg }
          {lastname && lastname.toUpperCase()} {firstname && toCapitalize(firstname)}
        </Card.Text>
        <Card.Text><FaHeart /> {likers.length}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;
