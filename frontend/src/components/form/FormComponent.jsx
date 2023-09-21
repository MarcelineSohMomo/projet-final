import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, button, Form, Fade } from "react-bootstrap";
import FirstStepCreation from "../service/FirstStepCreation";
import ServerMessage from "../serverMessage/ServerMessage";
import api from "../../api";
import { Navigate } from "react-router-dom";
import useCheckUserDetails from "../VerifyAuth/useCheckUserDetails";
import { getToken } from "../../util";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaEdit,
  FaMdb,
} from "react-icons/fa";
import "./FormComponent.scss";
import ImageUpload from "../imageUpload/ImageUpload";
import AvailabilityForm from "../AvailableForm/AvailableForm";
import GeolocationComponent from "../geolocalisation/Geolocalisation";

const FormComponent = () => {
  const [step, setStep] = useState(1);
  const [infostepOne, setInfostepOne] = useState({});
  const [navigateToServices, setNavigateToServices] = useState(false);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [tarification, setTarification] = useState([
    { prix: "", quantite: "" },
  ]);
  const [serverMessage, setServerMessage] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const { shouldNavigate, serverMessage: serverMessageCheckUser } =
    useCheckUserDetails();
  const [serviceId, setServiceId] = useState(null);
  const [geolocalisation, setGeolocalisation] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    var data = {
      ...infostepOne,
      others: textareaValue,
      tarification: tarification,
      geolocalisation: geolocalisation,
      token: getToken(),
    };
    try {
      const response = await api.createService(data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const res = await response;

      setServerMessage({
        message: res.data.message,
        type: "success",
      });
      console.log("res.data ", res.data.service);
      console.log("res.data.service._id", res.data.service._id);
      setServerMessageKey((prevKey) => prevKey + 1);
      setServiceId(res.data.service._id);
      // setTimeout(() => {
      //   setNavigateToServices(true);
      // }, 5000);

      data = {};
      setTextareaValue("");
      setTarification([{ prix: "", quantite: "" }]);
      setInfostepOne({});
    } catch (error) {
      const resolvedError = await error.response;
      setServerMessage({
        message: resolvedError?.data?.message,
        type: "error",
      });
      setServerMessageKey((prevKey) => prevKey + 1);
    }
  };

  const handleInfostepOne = (infostepOne) => {
    setInfostepOne(infostepOne);
  };
  const handleTarificationChange = (index, field, value) => {
    const newTarification = [...tarification];
    newTarification[index][field] = value;
    setTarification(newTarification);
  };

  const addRow = () => {
    setTarification([...tarification, { prix: "", quantite: "" }]);
  };

  const removeRow = (index) => {
    const newTarification = tarification.filter((_, i) => i !== index);
    setTarification(newTarification);
  };

  const getGeolocalisation = (data) => {
    setGeolocalisation(data);
  };

  console.log(geolocalisation);
  console.log(serviceId);
  return (
    <Container
      className="container"
      style={{ height: "90vh", overflowY: "scroll" }}
    >
      <div className="row form-component">
        <div className="col">
          <div className="row justify-content-center my-4">
            <span className={step == 1 ? "step-num" : "step-no-active"}>1</span>
          </div>
        </div>
        <div className="col">
          <div className="row justify-content-center my-4">
            <span className={step == 2 ? "step-num" : "step-no-active"}>2</span>
          </div>
        </div>
        <div className="col">
          <div className="row justify-content-center my-4">
            <span className={step == 3 ? "step-num" : "step-no-active"}>3</span>
          </div>
        </div>
      </div>
      <div className="row form-component">
        {shouldNavigate && <Navigate to="/profile" />}
        {serverMessageCheckUser && (
          <ServerMessage
            message={serverMessageCheckUser.message}
            type={serverMessageCheckUser.type}
            key={serverMessageKey}
          />
        )}
        {navigateToServices && <Navigate to="/home" />}
        {serverMessage && (
          <ServerMessage
            message={serverMessage.message}
            type={serverMessage.type}
            key={serverMessageKey}
          />
        )}

        <Row className="justify-content-md-between my-4">
          <Col xs={6} md={4}>
            <Card
              style={{
                transform: step === 1 ? "scale(1.09)" : "scale(1)",
                opacity: step === 1 ? 1 : 0.5,
                border: "0",
              }}
            >
              <Card.Body>
                <FirstStepCreation getInfostepOne={handleInfostepOne} />
                <span
                  variant="primary"
                  onClick={() => {
                    setStep(2);
                  }}
                  disabled={step !== 1}
                >
                  <FaArrowAltCircleRight size={22} color="gray" />
                </span>
                {step !== 1 && (
                  <button
                    variant="secondary"
                    onClick={() => setStep(1)}
                    className="ml-2 mx-3 es-button"
                    style={{
                      opacity: 1,
                    }}
                  >
                    Editer
                  </button>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={5}>
            <Card
              className="mt-4"
              style={{
                transform: step === 2 ? "scale(1.05)" : "scale(1)",
                opacity: step === 2 ? 1 : 0.5,
                border: "0",
              }}
            >
              <Card.Body>
                <Form.Group>
                  <Form.Label className="mt-4"></Form.Label>
                  <table className="mt-3">
                    <thead>
                      <tr>
                        <th className="es-subtitle">Offre</th>
                        <th className="es-subtitle">Prix</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tarification.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <Form.Control
                              placeholder="Ex: Standard, Premium etc.."
                              type="text"
                              value={row.prix}
                              onChange={(e) =>
                                handleTarificationChange(
                                  index,
                                  "prix",
                                  e.target.value
                                )
                              }
                              className="es-inputs"
                            />
                          </td>
                          <td>
                            <Form.Control
                              placeholder="Ex: 250$ etc.."
                              type="text"
                              value={row.quantite}
                              onChange={(e) =>
                                handleTarificationChange(
                                  index,
                                  "quantite",
                                  e.target.value
                                )
                              }
                              className="es-inputs"
                            />
                          </td>
                          <td>
                            <button
                              className="es-button es-button-delete "
                              onClick={() => removeRow(index)}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={addRow} className="mt-3 es-button">
                    Ajouter
                  </button>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label className="es-subtitle">Autres</Form.Label>
                  <Form.Control
                    className="es-textarea"
                    placeholder="Autres informations"
                    as="textarea"
                    rows={3}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                  />
                </Form.Group>
                <div className="row">
                  <div className="col">
                    <button
                      onClick={handleSubmit}
                      disabled={step !== 2}
                      className="mt-3 es-button"
                    >
                      Crée le service
                    </button>
                    {step !== 2 && (
                      <button
                        onClick={() => setStep(2)}
                        className="m-auto es-button"
                      >
                        Editer
                      </button>
                    )}
                  </div>
                  <div className="col d-flex align-items-center justify-content-end fa-icon">
                    {step == 2 && (
                      <span
                        className="icon-container "
                        onClick={() => setStep((prev) => prev - 1)}
                      >
                        <FaArrowAltCircleLeft size={22} color="gray" />
                      </span>
                    )}
                    <span
                      className="mx-3 icon-container"
                      onClick={() => {
                        setStep(3);
                      }}
                      disabled={step == 1 || step == 3}
                    >
                      <FaArrowAltCircleRight size={22} color="gray" />
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <div
              className="row mt-4 "
              style={{
                transform: step === 3 ? "scale(1.05)" : "scale(1)",
                opacity: step === 3 ? 1 : 0.5,
                border: "0",
              }}
            >
              <div className="row ">
                {serviceId ? <AvailabilityForm serviceID={serviceId} /> : ""}
              </div>
              <div className="row">
                <div className="col d-flex">
                  {step == 3 && (
                    <span
                      onClick={() => setStep((prev) => prev - 1)}
                      className="m-3  icon-container"
                    >
                      <FaArrowAltCircleLeft size={22} color="gray" />
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={step !== 3}
                    className="add-image es-button"
                  >
                    Ajout d'images
                  </button>
                </div>
              </div>

              <GeolocationComponent getGeolocalisation={getGeolocalisation} />
              <div className="row es-info-img">
                {serviceId ? <ImageUpload id={serviceId} /> : ""}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default FormComponent;
