import React, { useState } from "react";
import { Button } from "react-bootstrap";
import search from "../../assets/icons/search.svg";

const Sugession = () => {
  const [query, setQuery] = useState("");

  return (
    <>
      <div
        className="d-flex justify-content-between search "
        style={{ background: "#F5F4F4", borderRadius: "5px 0 0 5px" }}
      >
        <div className="d-flex">
          <input
            className="rounded border-sm bg-transparent"
            style={{ width: "400px", outline: "none" }}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ex: décoration"
          />
        </div>
        <Button
          className="d-flex justify-content-center ml-2 align-items-center text-white font-weight rounded"
          style={{ backgroundColor: "#1DBF73", height: "50px" }}
          onClick={() => console.log(query)}
        >
          Rechercher
        </Button>
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
