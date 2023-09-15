import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api";
import ServerMessage from "../../components/serverMessage/ServerMessage";
import { Row, Col, Carousel } from "react-bootstrap";
import Loading from "../../components/loading/Loading";
import { useTable } from 'react-table';
import { getToken, getUser } from "../../util";
import SmallServicesCard from "../../components/profil/SmallServicesCard";
import Window from "../../components/window/Window";
import BigServiceDetailCardForDashoard from "../../components/service/BigServiceDetailCardForDashoard";
import ChartStatistics from "../../components/chartJS/ChartStatistics";

const Statistics = () => {
  const [services, setServices] = useState([]);
  const [serverMessage, setServerMessage] = useState(null);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const isconnected =  localStorage.getItem("isconnected");
  const token =getToken();
  const userID = getUser()._id;
  const [commandsGroupByStatus, setCommandsGroupByStatus] = useState([]);

  const fetchServices = async () => {
    if (!isconnected) return Navigate("/signin");
    try {
      const res = await api.servicesByProvider({
        headers: {
          Authorization: `Bearer ${token}`,
          id: userID,
        },
      });
      console.log(res);
      setServices(res.data);
      setServerMessageKey((prevKey) => prevKey + 1);
      return res.data
    } catch (error) {
      setServerMessageKey((prevKey) => prevKey + 1);
      const resolvedError = await error.response;
      setServerMessage({
        message: resolvedError?.data?.message,
        type: "error",
      });
      console.log(
        "Une erreur s'est produite lors de la récupération des services ",
        error
      );
    }
  };

  const groupCommandsByStatus = async () => {
    try {
      const res = await api.groupCommandsByStatus({
        headers: {
          Authorization: `Bearer ${token}`,
          id: userID,
        },
      });

      console.log("group data  ", res.data)
      setCommandsGroupByStatus(res.data);
    } catch (error) {
      console.log(
        "Une erreur s'est produite lors de la récupération des commandes complétées ",
        error
      );
    }
  };

  useEffect(() => {
    const gets = async () => {
      const services = await fetchServices();
      groupCommandsByStatus();

    }
    gets();
  }, [isconnected]);

  return (
    <div className="service-dashboard" style={{height:"90vh", overflowY:"scroll"}}>
      {serverMessage && (
        <ServerMessage
          message={serverMessage.message}
          type={serverMessage.type}
          key={serverMessageKey}
        />
      )}
      {services.length !== 0 ? (
        <>
          
            {services.map((service, key) => (
              !service.isDeleted && <Row className=" mb-4">
                <Col  md={3} key={service._id} className=" mt-5 mb-5 over-service">
                    <SmallServicesCard shadow={"shadow-style"} key={key} height={"200px"} width={"200px"} service={service} />
                  <div className='icon'>
                    {/* <span className='action-service'> <FaEdit /> </span> */}
                    {/* <span className='action-service'> <FaTrash /> </span> */}
                    <Window> <BigServiceDetailCardForDashoard service={service} width={"200px"} height={"200px"} /> </Window>
                  </div>

                </Col>
                <Col md={8} >
                  <ChartStatistics  commandsByService={commandsGroupByStatus[service._id]}/>
                </Col>
              </Row>
            ))}
          
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Statistics;
