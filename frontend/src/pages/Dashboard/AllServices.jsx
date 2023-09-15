import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api';
import ServerMessage from '../../components/serverMessage/ServerMessage';
import { Row, Col, Carousel } from 'react-bootstrap';
import DetailedService from './DetailedService';
import { getToken, getUser } from '../../util';
import SmallServicesCard from '../../components/profil/SmallServicesCard';
import Window from '../../components/window/Window';
import BigServiceDetailCardForDashoard from '../../components/service/BigServiceDetailCardForDashoard';
import { FaEdit, FaTrash } from 'react-icons/fa';
import WindowForUpdateService from '../../components/window/WindowForUpdateService';
import EditService from '../../components/service/EditService';
import Loading from '../../components/loading/Loading';

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [serverMessage, setServerMessage] = useState(null);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [reLoading, setReLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingService, setLoadingService] = useState(false);
  const token = getToken();
  const fetchServices = async () => {
    if (!localStorage.getItem('isconnected')) return Navigate('/signin');

    try {
      await api.getServices({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        console.log(res)
        setServices(res.data);
        setServerMessageKey((prevKey) => prevKey + 1);
      });
    } catch (error) {
      setServerMessageKey((prevKey) => prevKey + 1);
      const resolvedError = await error.response;
      setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
      console.log("Une erreur c'est produit lors de la recupération des services ", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [token, reLoading]);

  const removeService = async (serviceId) => {
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

  console.log("Showing loading ", showLoading);

  return (
    <div className='service-dashboard'>
      {serverMessage && (
        <ServerMessage
          message={serverMessage.message}
          type={serverMessage.type}
          key={serverMessageKey}
        />
      )}
            <br />
      <br />
      <br />
      <br />
      {
        services.length !== 0 ?
        <Row className="mb-4" >
          {
            services.map((service, key) => (
            !service.isDeleted && <Col md={3} key={service.id} className=" mb-5 over-service">
              <div onClick={() => setSelectedService(service)}>
                <SmallServicesCard shadow={"shadow-style"} key={key} height={"200px"} width={"200px"} service={service} />
              </div>
              <div className='icon' onClick={()=> setSelectedService(service)}>
                {
                  (getUser().roles[0].name === "admin" || getUser()._id === service.providerId ||  getUser()._id === service.providerId._id) ?
                  <>
                      <WindowForUpdateService showEditIcon={true} > 
                      <EditService service={service} setReLoading={setReLoading} />
                    </WindowForUpdateService>
                      <span className='action-service' onClick={() => removeService(service._id)}>
                      <FaTrash /> 
                      </span>
                    <Window> <BigServiceDetailCardForDashoard service={service} width={"200px"} height={"200px"} /> </Window>
                
                </> : null}
              </div>
              
            </Col>
          ))}
        </Row> :
        <Loading />
      }
      <div>
        {
          showLoading &&
              <Loading />
        }
      </div>
    </div>
  );
};

export default AllServices;
