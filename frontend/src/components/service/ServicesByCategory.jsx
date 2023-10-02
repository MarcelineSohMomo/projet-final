import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import SmallServicesCard from "../profil/SmallServicesCard";
import ServiceCard from "./ServiceCard";
import "./service.scss";

const ServicesByCategory = ({ services }) => {
  const groupedServices = services.reduce((acc, service) => {
    const category = service.categorie;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  return (
    <Container>
      {Object.entries(groupedServices).map(([category, services]) => (
        <div key={category._id}>
          <Row className="justify-content-center">
            {services.map(
              (service) =>
                !service.isDeleted && (
                  <Col md={3} key={service.id} className=" m-3">
                    <Link to={`/services/${service._id}`}>
                      <SmallServicesCard
                        width={"200px"}
                        height={"180px"}
                        service={service}
                        shadow={"box-shadow-service"}
                      />
                    </Link>
                    <div className="row provider-content">
                      <h6>Categorie: {service.categorie.name}</h6>

                      <div className="col">
                        <Link to={`/viewuser/${service.providerId._id}`}>
                          {!service.providerId.img ? (
                            <img
                              src=""
                              width="50"
                              height="50"
                              style={{ backgroundColor: "gray" }}
                              alt=""
                              srcset=""
                            />
                          ) : (
                            <Image
                              src={`http://localhost:5000/${service.providerId.img}`}
                              roundedCircle
                              alt="Profile"
                              width="50"
                              height="50"
                            />
                          )}
                        </Link>
                      </div>
                      <div className="col d-flex justify-content-center align-items-center provider-name">
                        <span> {service.providerId.lastname} </span>{" "}
                        &nbsp;&nbsp;
                        <span> {service.providerId.firstname} </span>
                      </div>
                    </div>
                  </Col>
                )
            )}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default ServicesByCategory;
