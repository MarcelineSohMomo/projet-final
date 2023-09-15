import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api';
import ServerMessage from '../../components/serverMessage/ServerMessage';
import { Row, Col, Carousel, Form, Button } from 'react-bootstrap';
import DetailedService from './DetailedService';
import Loading from '../../components/loading/Loading';
import { getToken, getUser } from '../../util';
import SmallServicesCard from '../../components/profil/SmallServicesCard';
import { FaBullseye, FaCheck, FaEdit, FaEye, FaEyeSlash, FaPlus, FaStreetView, FaTrash } from 'react-icons/fa';
import Window from '../../components/window/Window';
import BigServiceDetailCardForDashoard from '../../components/service/BigServiceDetailCardForDashoard';
import EditService from '../../components/service/EditService';
import WindowForUpdateService from '../../components/window/WindowForUpdateService';
import "./services.scss"
const Services = () => {
  const [services, setServices] = useState([]);
  const [serverMessage, setServerMessage] = useState(null);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [loadingService, setLoadingService] = useState(null);
  const [reLoading, setReLoading] = useState(false);
  const isconnected =  localStorage.getItem("isconnected");
  const token = getToken();
  const userID = getUser()._id;
  const [showLoading, setShowLoading] = useState(false);
  const [providers, setProviders] = useState(null);
  const [selectedProviderId, setselectedProviderId] = useState(null);
  const [serviceOptions, setServiceOptions] = useState({});

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userID
    },
  }

  const fetchProviders = async ()=>{
    try {
      await api.getProvider_Moderateur_Admin(header)
      .then(res => {
        console.log("res.data ", res.data);

        setProviders(res.data);
      })
      setShowLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  const fetchServices = async () => {
    if (!isconnected) return Navigate('/signin');
    try {
      setLoadingService(true)
      await api.servicesByProvider({
        headers: {
          Authorization: `Bearer ${token}`,
          id: userID,
        },
      }).then((res) => {
        setServices(res.data);
        setServerMessageKey((prevKey) => prevKey + 1);
      });
    } catch (error) {
      setServerMessageKey((prevKey) => prevKey + 1);
      const resolvedError = await error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      console.log("Une erreur c'est produit lors de la recupération des services ", error);
    }finally{
      setLoadingService(false)
    }
  };

  const removeService = async (serviceId) => {
    console.log("service ", serviceId)
    setShowLoading(true);
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        await api.deleteService({
          headers: {
            Authorization: `Bearer ${token}`,
            id: serviceId
          },
        }).then(res => {
          console.log(res)
          setServerMessage({ message: res.data.message, type: 'success' });
          setServerMessageKey(prev =>prev+1)
        })
        setReLoading((prev) => !prev); 
        
      } catch (error) {
        console.log(error)
        const resolvedError = await error.response;
        setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
        console.log("Une erreur s'est produite lors de la suppression du service ", error);
      }finally{
        setShowLoading(false);
      }


    }
  };

  useEffect(() => {
    fetchServices();
    fetchProviders();
  }, [isconnected, reLoading]);
  
  const handleChange= async (e, serviceId) => {
    const provider = providers.find(item => item._id === e.target.value)

    setselectedProviderId({
        ...selectedProviderId,
        futureProviderName: provider.firstname +" "+provider.lastname,
        futureProviderId: e.target.value,
        serviceId:serviceId
    });
  }
  const handleClickPlus = (serviceId) =>{
    setServiceOptions((prevState) => ({
      [serviceId]: !prevState[serviceId],
    }));
    setselectedProviderId({});
  }
  const handleSendData =async () => {

    console.log('Données à envoyer :', selectedProviderId);
    try{
      await api.copyServiceTo({
          serviceId: selectedProviderId.serviceId
        },{
          headers: {
            Authorization: `Bearer ${token}`,
            id: selectedProviderId.futureProviderId,
          },
        })
        .then((res) => {
        setServerMessage({ message: res.data.message, type: 'success' });
        setServerMessageKey((prevKey) => prevKey + 1);
      });
    } catch (error) {
      setServerMessageKey((prevKey) => prevKey + 1);
      const resolvedError = await error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      console.log("Une erreur c'est produit lors de la copie du service ", error);
    }finally{
      setLoadingService(false)
    }
  };

  return (
    <div className='service-dashboard'>
      {serverMessage && (
        <ServerMessage
          message={serverMessage.message}
          type={serverMessage.type}
          key={serverMessageKey}
        />
      )}
      {!loadingService ? 
      <>

        <Row className="mb-4" >
          { services.length !== 0 ?
             services.map((service, key) => (
              !service.isDeleted && <Col md={3} key={service.id} className=" mb-5 over-service">
              <SmallServicesCard shadow={"shadow-style"} key={key} height={"200px"} width={"200px"} service={service} />
              <div className='icon' >
                <WindowForUpdateService showEditIcon={true} > 
                  <EditService service={service} setReLoading={setReLoading} />
                </WindowForUpdateService>
                <span className='action-service' onClick={() => removeService(service._id)}>
                   <FaTrash /> 
                </span>
                <Window> <BigServiceDetailCardForDashoard service={service} width={"200px"} height={"200px"} /> </Window>
                <span className='action-service' key={key} onClick={() => handleClickPlus(service._id)}>
                  <FaPlus  />
                </span>
                
                  {serviceOptions[service._id]  && (
                    <Form.Group controlId="categorie" className='mt-4'>
                      <div className="d-flex">
                      <Form.Control
                        as="select"
                        value={selectedProviderId}
                        onChange={(event) => handleChange(event, service._id)}
                        className="es-inputs providers"
                      >
                        <option >Copier à {selectedProviderId && selectedProviderId.futureProviderName}</option>
                        {providers && providers.map((provider) => {
                          console.log(provider.listservices.includes(service._id))
                          if(!provider.listservices.includes(service._id)){
                            return <option key={provider._id} value={provider._id}>
                              {provider.firstname  +" "+ provider.lastname}
                            </option>
                          }
                          return null;
                        })}
                      </Form.Control>
                      <span className='row justify-content-center align-items-center m-1 copy-data' style={{ cursor: 'pointer' }}>
                        <FaCheck size={25} onClick={handleSendData} color='green'/>
                      </span>
                      </div>
                    </Form.Group>
                  )}
              </div>
            </Col>
          )) : <div>Aucun service crée</div>  }
        </Row>
        <Row>
          {/* {selectedService && (
            <DetailedService key={selectedService._id} service={selectedService} />
          )} */}

          {
            showLoading && <Loading />
          }
        </Row> 
      </>: <Loading/>}
    </div>
  );
};

export default Services;
