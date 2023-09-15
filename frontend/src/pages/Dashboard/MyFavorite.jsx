import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../api';
import Loading from '../../components/loading/Loading';
import SmallServicesCard from '../../components/profil/SmallServicesCard';
import ServerMessage from '../../components/serverMessage/ServerMessage';
import BigServiceDetailCardForDashoard from '../../components/service/BigServiceDetailCardForDashoard';
import Window from '../../components/window/Window';
import { getToken, getUser } from '../../util';


const MyFavorite = () => {

    const token = getToken();
    const userID = getUser()._id;
    const [favorites, setFavorites] = useState([]);
    const [serverMessage, setServerMessage] = useState(null); 
    const [serverMessageKey, setServerMessageKey] = useState(0);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const header = {
        headers: {
          Authorization: `Bearer ${token}`,
          id: userID
        }
    };
    const removeFavorite = async(service) => {
        console.log("service favorite : ", service)
        const header = {
          headers: {
            Authorization: `Bearer ${token}`,
            id: service._id
          },
        };
        try {
          setLoadingDelete(!loadingDelete)
          const res = await api.toggleFavorite(header);
          console.log("response : ", res)
        } catch (error) {
          console.error(error);
        }finally{
          setLoadingDelete(!loadingDelete)
        }
    }
    const getFavorites = async () => {
      try {
          setLoadingFavorite(true);
          const res = await api.getFavoriteServices(header);
          console.log("res ", res)
          setFavorites(res.data);
      } catch (error) {
          const resolvedError = error.response;
          setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
          setServerMessageKey(prevKey => prevKey + 1);
      }finally{
        setLoadingFavorite(false)
      }
    }
    useEffect( () => {
      getFavorites();
    }, []);

    console.log("favorites : ", favorites)
    return (
        <div className='service-dashboard my-favorite'>
          {serverMessage && (
            <ServerMessage
              message={serverMessage.message}
              type={serverMessage.type}
              key={serverMessageKey}
            />
          )}
          {!loadingFavorite ? 
          <>
            <Row className="mb-4" >
              {
                favorites.map((service, key) => (
                <Col md={3} key={service._id} className=" mb-5 over-service">
                  <SmallServicesCard shadow={"shadow-style"} key={key} height={"200px"} width={"200px"} service={service} />
                    <div className="icon">
                      <span className='action-service' onClick={() => removeFavorite(service)}> <FaTrash /> </span>
                      <Window> <BigServiceDetailCardForDashoard dontModifyFavorite={true} service={service} width={"200px"} height={"200px"} /> </Window>
                    </div>
                </Col>
              ))}
            </Row>
          </>: <Loading/>}
          {
            loadingDelete ? <Loading /> : null
          }
        </div>
      );
};

export default MyFavorite;
