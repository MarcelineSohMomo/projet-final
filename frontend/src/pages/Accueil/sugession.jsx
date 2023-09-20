import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const Sugession = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState([]);

  const handleSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation([latitude, longitude]);
  };

  const handleError = () => {
    setError(
      "Impossible de récupérer votre localisation, vous ne pourrez pas rechercher de services"
    );
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      setError(
        "La géolocalisation n'est pas prise en charge par votre navigateur."
      );
    }
  }, []);

  const handleSearch = () => {
    if (location.length === 0) {
      setError(
        "Vous ne pouvez pas lancer de recherche car vous n'avez pas autorisé l'accès à votre localisation. Veuillez actualiser la page et autoriser l'accès à votre localisation."
      );
    } else {
      // hit endpoint to search
    }
  };

  return (
    <>
      <div

      // style={{ background: "#F5F4F4", borderRadius: "5px 0 0 5px" }}
      >
        <div className="d-flex">
          <input
            className="rounded border-sm bg-transparent px-2"
            style={{ width: "400px", marginRight: 4, outline: "none" }}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ex: décoration"
          />
          <Button
            className="text-white rounded"
            style={{ backgroundColor: "#1DBF73", height: "50px" }}
            onClick={() => console.log(query)}
            disabled={query.trim() ? false : true}
          >
            Rechercher
          </Button>
        </div>
        <p className="text-danger mt-1">{error}</p>
      </div>
      <div className="d-flex my-4">
        <div className="flex justify-content-center  align-items-center ">
          Les plus populaires :
        </div>
        <div
          style={{
            color: "#7A7A7A",
            border: "1px solid #7A7A7A",
            borderRadius: "30px",
          }}
          className="mx-2 p-2"
        >
          Coiffure
        </div>
        <div
          style={{
            color: "#7A7A7A",
            border: "1px solid #7A7A7A",
            borderRadius: "30px",
          }}
          className="mx-1.5 p-2"
        >
          Esthétique
        </div>
      </div>
    </>
  );
};

export default Sugession;
