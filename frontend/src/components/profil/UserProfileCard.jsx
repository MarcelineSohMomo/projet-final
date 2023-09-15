import React from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { FaMailBulk, FaMailchimp, FaVoicemail } from 'react-icons/fa';
import './profil.scss';


const UserProfileCard = ({ user }) => {
    return (
        <Card className='user-profil-card'>
            <Row>
                <Col xs={2} className="d-flex align-items-center justify-content-center" >
                    <Image src={`http://localhost:5000/${user.img}`} roundedCircle height="50" width="50" />
                </Col>
                <Col xs={10}>
                    <Card.Body className='user-name'>
                        <span>{`${user.firstname}`}</span>
                        <span>{`${user.lastname}`}</span>
                        <Card.Text className='user-email'>
                            <FaMailBulk /> {user.email}
                        </Card.Text>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

export default UserProfileCard;
