import React, { useEffect } from 'react';
import UserProfile from './ProfileInfoForm';
import ProfileImageForm from './ProfileImageForm';
import CustomNavbar from '../../components/CustomNavbar/CustomNavbar';
import { Col, Container, Row } from 'react-bootstrap';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../../components/VerifyAuth/AuthGuard';
import Loading from '../../components/loading/Loading';
import VerifyAuth from '../../components/VerifyAuth/VerifyAuth';
import "./userprofil.scss"

const User = () => {
  const isconnected =  localStorage.getItem("isconnected");
  const  user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isconnected) return navigate("/signin");
  }, [isconnected, navigate]);

  if (!isconnected ) {
    return <>
      <CustomNavbar />
      <Row className='justify-content-center'>
        <h3>Reconnecte vous pour que les mises à jour soient appliquees</h3>
      </Row>
      <Loading />

    </>;
  }else{
    <Loading />
  }

  
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
    <VerifyAuth>
        <CustomNavbar addstyle={"addstyle"}/>
        <Container className='edit-user-profil edit-user-profil' style={{height:'90vh', overflowY:"scroll"}}>
            <Row className='my-5' >
              <Col md={3}>
                <Row className='roundedImage'>
                  <img src={`http://localhost:5000/${user.img}`} alt="" srcset="" />
                </Row>
                <AuthGuard>
                  <ProfileImageForm user={userData} />
                </AuthGuard>
              </Col>
              <Col md={9} className="info-perso">
                <Row>
                <Col><p id="id1" >Mes informations personnelles</p></Col>
                <Col><span className='roles-user'>Role: {user.roles.name}</span></Col>
                
                </Row>
                <AuthGuard>
                  <UserProfile user={userData} />
                </AuthGuard>
              </Col>
            </Row>
        </Container>
    </VerifyAuth>
  );
};
export default User;

