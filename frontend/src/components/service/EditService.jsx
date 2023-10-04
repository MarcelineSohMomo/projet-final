import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { getToken } from "../../util";
import ImageUpload from "../imageUpload/ImageUpload";
import Loading from "../loading/Loading";
import "./editService.scss";
import ServerMessage from "../serverMessage/ServerMessage";

const EditService = ({ service, setReLoading }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(service.tarification);
  const [updatedData, setUpdatedData] = useState({
    name: service.name,
    description: service.description,
    others: service.others,
    categorie: service.categorie,
    keywords: service.keywords,
  });
  const [tags, setTags] = useState(
    service.keywords ? service.keywords.split(",") : []
  );
  const [tag, setTag] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);
  const header = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      id: service._id,
    },
  };
  const addInput = () => {
    setInputs([
      ...inputs,
      {
        prix: "",
        quantite: "",
      },
    ]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("inputs : ", inputs);

    const allData = {
      ...updatedData,
      tarification: [...inputs],
    };
    console.log("allData : ", allData);

    try {
      setIsLoading(!isLoading);

      await api.updateService(allData, header).then((res) => {
        setServerMessage({
          message: res.data.message,
          type: "success",
        });
        navigate("/dashboard/services");
      });
      setInputs(service.tarification);
      setReLoading(true);
    } catch (error) {
      setServerMessage({
        message: error.response.data.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const removeInput = (index) => {
    const updatedInputs = inputs.filter((_, i) => i !== index);
    setInputs(updatedInputs);
  };
  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };
  const getTarifData = (index, champ, valeur) => {
    const nouveauxInputs = [...inputs];
    nouveauxInputs[index][champ] = valeur;
    setInputs(nouveauxInputs);
  };

  return (
    <div className="row edit-service">
      <div className="col-8 es-info-text">
        <div className="row">
          <input
            className="es-inputs es-inputs-title"
            name="name"
            type="text"
            placeholder="Nom du service"
            value={updatedData.name}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <textarea
            onChange={handleChange}
            className="es-textarea"
            name="description"
            placeholder="Décrivez votre prestation"
            id=""
            cols="30"
            rows="4"
            value={updatedData.description}
          ></textarea>
        </div>
        <div className="row">
          <p className="es-subtitle">Catégorie</p>
          <select
            onChange={handleChange}
            name="categorie"
            className="es-inputs"
          >
            {categories.map((category) => (
              <option
                key={category._id}
                selected={updatedData.categorie._id === category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          <p className="es-subtitle p-0">Mots clés</p>
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
                        setUpdatedData({
                          ...updatedData,
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
            <input
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
                setUpdatedData({
                  ...updatedData,
                  keywords: [...tags, tag].toString(),
                });
              }}
              disabled={tag.trim() ? false : true}
            >
              Ajouter
            </button>
          </div>
        </div>
        <div className="row justify-content-center ">
          <p className="es-subtitle p-0">Différentes formule</p>
          {inputs.map((input, index) => (
            <div className="p-0 row">
              <p className="input-row" key={index}>
                <input
                  className="es-inputs "
                  value={input.prix}
                  type={"text"}
                  onChange={(e) => getTarifData(index, "prix", e.target.value)}
                />
                <input
                  className="es-inputs "
                  value={input.quantite}
                  type={"text"}
                  onChange={(e) =>
                    getTarifData(index, "quantite", e.target.value)
                  }
                />
                <button
                  className="es-inputs es-button-delete"
                  onClick={() => removeInput(index)}
                >
                  Supprimer
                </button>
              </p>
            </div>
          ))}
          <div className="">
            <button className="es-button" onClick={addInput}>
              Ajouter un nouveau{" "}
            </button>
          </div>
        </div>
        <div className="row">
          <p className="es-subtitle p-0">Autres...</p>
        </div>
        <div className="row">
          <textarea
            className="es-textarea"
            onChange={handleChange}
            name="others"
            placeholder="Autres informations"
            id=""
            cols="30"
            rows="4"
            value={updatedData.others}
          ></textarea>
        </div>
        <div className="row ">
          <div
            onClick={handleSave}
            className="col d-flex justify-content-center"
          >
            <button className="es-button es-appliquer">Appliquer</button>
          </div>
        </div>
        {serverMessage && (
          <ServerMessage
            message={serverMessage.message}
            type={serverMessage.type}
          />
        )}
      </div>
      <div className="col-4 es-info-img">
        <ImageUpload id={service._id} />
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default EditService;
