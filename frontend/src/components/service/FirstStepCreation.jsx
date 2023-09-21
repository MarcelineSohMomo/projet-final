import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import api from "../../api";
import ServerMessage from "../serverMessage/ServerMessage";

const FirstStepCreation = ({ getInfostepOne }) => {
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    imgs: [],
    tarification: {},
    categorie: "",
    extradata: {},
    keywords: "",
  });
  const [serverMessage, setServerMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleChange = (e) => {
    setServiceData({
      ...serviceData,
      [e.target.id]: e.target.value,
    });
    getInfostepOne({
      ...serviceData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Row className="mt-3 ">
      <h2 className="mb-4 title-new-service">nouveau service</h2>
      {serverMessage && (
        <ServerMessage
          message={serverMessage.message}
          type={serverMessage.type}
        />
      )}
      <Form.Group controlId="name">
        <Form.Label className="es-subtitle">Nom du service</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entrez le nom du service"
          value={serviceData.name}
          onChange={handleChange}
          className="es-inputs"
        />
      </Form.Group>
      <Form.Group controlId="description">
        <Form.Label className="es-subtitle">Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Entrez une description du service"
          value={serviceData.description}
          onChange={handleChange}
          className="es-textarea"
        />
      </Form.Group>
      <Form.Group controlId="categorie">
        <Form.Label className="es-subtitle">Catégorie</Form.Label>
        <Form.Control
          as="select"
          value={serviceData.categorie}
          onChange={handleChange}
          className="es-inputs"
        >
          <option>Choisissez une catégorie...</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="tags">
        <Form.Label className="es-subtitle">Mots clés</Form.Label>
        <div className="mb-4">
          {tags &&
            tags.map((atag, index) => {
              return (
                <div key={index} className="d-flex mt-2">
                  <p>{atag}</p>
                  <button
                    className="mx-2 es-button es-button-delete"
                    onClick={() => {
                      const newTags = tags.filter((tag) => tag !== atag);
                      setTags(newTags);
                      setServiceData({
                        ...serviceData,
                        keywords: newTags.toString(),
                      });
                      getInfostepOne({
                        ...serviceData,
                        keywords: newTags.toString(),
                      });
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              );
            })}
        </div>
        <div className="d-flex">
          <Form.Control
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Ajouter un mot clé"
            className="es-inputs"
          />
          <button
            variant="secondary"
            className="ml-2 mx-3 es-button"
            style={{ marginLeft: 8, height: "80%", opacity: 1 }}
            onClick={() => {
              setTags([...tags, tag]);
              setTag("");
              setServiceData({
                ...serviceData,
                keywords: [...tags, tag].toString(),
              });
              getInfostepOne({
                ...serviceData,
                keywords: [...tags, tag].toString(),
              });
            }}
            disabled={tag.trim() ? false : true}
          >
            Ajouter
          </button>
        </div>
      </Form.Group>
      {/* <Col><Button className=' my-2' variant="success" onClick={handleSubmit}>
                Enrégistrer
            </Button></Col> */}
    </Row>
  );
};

export default FirstStepCreation;
