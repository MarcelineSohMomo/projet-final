import React from 'react';
import UserProfile from './ProfileInfoForm';
import ProfileImageForm from './ProfileImageForm';
import CustomNavbar from '../../components/CustomNavbar/CustomNavbar';
import { Col, Container, Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { getUser } from '../../util';


const ProfileWithoutnavbar = () => {
const isconnected = localStorage.getItem("isconnected");

  if(!isconnected)  
    return Navigate('/signin');
  const user = getUser();
  const userData = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
    description: user.description,
    languages: user.languages,
    certifications: user.certifications,
    qualification: user.qualification,
  };

  return (
    <div>
        <Container>
            <Row className='my-5 edit-user-profil'>
                <Col md={8}>
                <h3 className='es-inputs-title2'>Mes informations personnelles</h3>
                    <UserProfile user={userData} />
                </Col>
                <Col md={4}>
                    <h4 className='es-inputs-title2' >Mettre à jour mon image profil</h4>
                    <ProfileImageForm user={userData} />
                </Col>
            </Row>
        </Container>
        
    </div>
  );
};

export default ProfileWithoutnavbar;

