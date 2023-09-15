import React, { Fragment, useEffect, useState } from 'react';
import { Button, Container, Row, Col, Image, ListGroup, Table, Form } from 'react-bootstrap';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { getToken, getUser } from '../../util';
import Commande from '../commade/Commande';
import CommentsList from '../comment/CommentsList';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import Favorite from '../favorite/Favorite';
import Footer from '../footer/Footer';
import Loading from '../loading/Loading';
import NotesList from '../note/NotesList';
import ServerMessage from '../serverMessage/ServerMessage';
import AuthGuard from '../VerifyAuth/AuthGuard';
import './service.scss'


const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [total, setTotal] = useState(0);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [serverMessage, setServerMessage] = useState(null);
  const [navigateToDashboard, setNavigateToDashboard] = useState(false);
  const navigate = useNavigate();

  const isconnected = localStorage.getItem("isconnected");
  const headers = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      id:id
    },
  }
  useEffect(() => {
    const fetchData = async () => {
      if(!isconnected)  
        return Navigate('/signin');
      try {
        await api.getService(headers)
        .then(res => {
          console.log(res)
          setService(res.data);
        })
      } catch (error) {
        console.log(error)
      }
    };
  
    fetchData();
  }, [id]);
  

  const handleSubmitOrder = async () => {
    const newCommande = {
      serviceId: service._id,
      name: service.name, 
      customer: getUser()._id,
      price: total, 
      status: 'pending',
    }
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const response = await api.createCommande(newCommande, headers);
      setServerMessageKey(prevKey => prevKey + 1);
      setServerMessage({
        message: response.data.message,
        type: 'success',
      });
      setTimeout(() => {
        setNavigateToDashboard(true);
      }, 5000);
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      setServerMessageKey(prevKey => prevKey + 1);
      console.log(error);
    }
  };

  const handleAdd = (tarif) => {
    setTotal(total + Number(tarif.prix));
  }

  const handleRemove = (tarif) => {
    setTotal(total - Number(tarif.prix));
  };
  

  console.log("service ", service)
  return (
    <Fragment>
      <AuthGuard >
        <CustomNavbar addstyle={"addstyle"}/>
        <br />
        <br />
        <br />
        {navigateToDashboard && <Navigate to="/dashboard" />}
        {serverMessage && (
            <ServerMessage
              message={serverMessage.message}
              type={serverMessage.type}
              key={serverMessageKey}
            />
        )}
        <Container className='my-4'> { service ?
          <>
          <Row>
            <Col md={6} >
              <div><span className=''>Catégorie</span> : <span className='bg-success text-white m-2 p-2 rounded'>{service.categorie && service.categorie.name}</span></div> 
              <h2 className='my-4'>{service.name}</h2>
              <h3 className='my-4'>Description</h3>
              <p>{service.description}</p>
              <p>Tarification du service: {service.tarification.prix}</p>
              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      service.tarification.map((row, index) => (
                        <tr key={index}>
                          <td> {row.prix} </td>
                          <td> {row.quantite} </td>
                          <td></td>
                        </tr>
                      ))
                    }
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                  {service.imgs &&
                    service.imgs.map((img, idx) => (
                      <Col key={idx}>
                        <Image src={`http://localhost:5000/${img}`} thumbnail />
                      </Col>
                    ))}
                </Row>
              <h3 className='pt-3 my-4'>Fournisseur</h3>
              <Row>
                
                <Col md={6} >
                  <Row>
                    <Col md={3} >
                      <Image
                          src={`http://localhost:5000/${service.providerId.img}`}
                          roundedCircle
                          width="50"
                          height="50"
                        />
                    </Col>
                    <Col md={6} >
                      <p>{service.providerId.firstname.toUpperCase()} {service.providerId.lastname}</p>
                    </Col>
                  </Row>
                </Col>
                <Col md={6} >
                  <Favorite service={service} />
                </Col>
              </Row>
              
              <h5 className='mt-5 text-secondary'>Certifications</h5>
              <ListGroup>
                  {service.providerId.certifications &&
                    service.providerId.certifications.map((cert, idx) => (
                      <ListGroup.Item key={idx}>{cert.name}</ListGroup.Item>
                    ))}
                </ListGroup>

                <Button className='my-3' onClick={() => navigate(`/inbox/${service._id}`)}>
                  Contacter le fournisseur
                </Button>

            </Col>
            <Col md={6} className="p-4 border rounded">
              <h4>Informations sur la commande</h4>
              <Commande tarifications={service.tarification} onRemove={handleRemove} onAdd={handleAdd} />
              <p>Total: {total}</p>
              <Row className='my-3'>
                <h6>Délai de livraison <span className='bg-success m-2 rounded p-2 text-white'>02 jours</span></h6>
              </Row>
              <Button onClick={handleSubmitOrder}>Lancer la commande</Button>
              {/* <Button onClick={handleSubmitOrder} className="m-3">Ajouter au panier</Button> */}

            </Col>
          </Row>
          <Row>
            <CommentsList serviceId={service._id}  listcomments={service.listcomments} />
          </Row>
          </> :<Loading />
          }
        </Container>
        <Footer />
      </AuthGuard>
    </Fragment>
  );
};


export default ServiceDetails;

