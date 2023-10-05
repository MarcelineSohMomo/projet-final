import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, ButtonGroup } from "react-bootstrap";
import api from "../../api";
import Loading from "../../components/loading/Loading";
import { getToken, getUser } from "../../util";
import SmallCommandeCard from "../../components/profil/SmallCommandeCard";
import "./mycommande.scss";
import ConfirmationDialog from "../../components/confirmationDialog/ConfirmationDialog";
import { FaCheck, FaTrash } from "react-icons/fa";

const CommandeClient = () => {
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [serverMessage, setServerMessage] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isValidate, setValidate] = useState(false);
  const [isLoadingCommandes, setLoadingCommandes] = useState(false);
  const [status, setStatus] = useState("");
  const [sortby, setSortby] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [order, setOrder] = useState("");

  const token = getToken();
  const userID = getUser()._id;
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userID,
    },
  };

  const getCommandes = async () => {
    await api
      .getCommandesByProvider(header)
      .then((res) => {
        console.log(res);
        setCommandes(res.data);
        setServerMessage({ message: res.data.message, type: "success" });
        setServerMessageKey((prev) => prev + 1);
      })
      .catch((error) => {
        const resolvedError = error.response;
        setServerMessage({
          message: resolvedError?.data?.message,
          type: "error",
        });
        setServerMessageKey((prev) => prev + 1);
      });
  };

  useEffect(() => {
    try {
      setLoadingCommandes(true);

      getCommandes();
    } catch (error) {
    } finally {
      setLoadingCommandes(false);
    }
  }, [status, isValidate]);

  const handleValidate = async (commande, update_status) => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
        id: commande._id,
      },
    };
    try {
      setLoading(true);
      setValidate(true);
      await api
        .updateCommande({ status: update_status }, header)
        .then((res) => {
          setStatus(res.data.status);
          console.log("res.data ", res.data);
          setServerMessageKey((prevKey) => prevKey + 1);
          setServerMessage({
            message: res.data.message,
            type: "success",
          });
        });
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({
        message: resolvedError?.data?.message,
        type: "error",
      });
      setServerMessageKey((prevKey) => prevKey + 1);
      console.log(error);
    } finally {
      setLoading(false);
      setValidate(false);
    }
  };

  const filterData = async () => {
    try {
      setLoadingCommandes(true);
      const response = await api.triCommande({
        headers: {
          Authorization: `Bearer ${token}`,
          id: userID,
          sortby,
          sortStatus,
          order,
        },
      });

      setCommandes(response.data);
    } catch (error) {
      setServerMessage({ message: error?.response?.message, type: "error" });
      setServerMessageKey((prevKey) => prevKey + 1);
    } finally {
      setLoadingCommandes(false);
    }
  };

  const handleConfirmDelete = async (commande) => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
        id: commande._id,
      },
    };

    try {
      setLoading(true);
      setValidate(true);
      await api.deleteCommande(header).then((res) => {
        setServerMessageKey((prevKey) => prevKey + 1);
        setServerMessage({
          message: res.data.message,
          type: "success",
        });
      });
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({
        message: resolvedError?.data?.message,
        type: "error",
      });
      setServerMessageKey((prevKey) => prevKey + 1);
      console.log(error);
    } finally {
      setLoading(false);
      setValidate(false);
    }
  };
  const handleDelete = async () => {
    setShowDialog(true);
  };

  console.log("status ", status);
  console.log("isValidate ", isValidate);
  return (
    <div style={{ height: "90vh", overflowY: "scroll" }}>
      {isLoadingCommandes && <Loading />}
      <ConfirmationDialog
        show={showDialog}
        handleClose={() => setShowDialog(false)}
        handleConfirm={handleConfirmDelete}
        message="Êtes-vous sûr de vouloir supprimer cette commande ?"
      />
      <p className="commandes">Commandes de mes clients </p>
      {commandes && (
        <div className="row">
          <h5>Les Tris</h5>
          <div className="col-md-3 ">
            <h6>Trier par</h6>
            <label>
              <input
                style={{ marginRight: 4, marginLeft: 4 }}
                onChange={(e) => setSortby(e.target.value)}
                type="radio"
                name="trierpar"
                value="name"
              />
              Name
            </label>
            <label>
              <input
                style={{ marginRight: 4, marginLeft: 4 }}
                onChange={(e) => setSortby(e.target.value)}
                type="radio"
                name="trierpar"
                value="date"
              />
              Date
            </label>
          </div>
          <div className="col-md-3 ">
            <h6>Status</h6>
            <label>
              <input
                style={{ marginRight: 4, marginLeft: 4 }}
                onChange={(e) => setSortStatus(e.target.value)}
                type="radio"
                name="status"
                value="pending"
              />
              Pending
            </label>
            <label>
              <input
                style={{ marginRight: 4, marginLeft: 4 }}
                onChange={(e) => setSortStatus(e.target.value)}
                type="radio"
                name="status"
                value="completed"
              />
              Completed
            </label>
            <label>
              <input
                style={{ marginRight: 4, marginLeft: 4 }}
                onChange={(e) => setSortStatus(e.target.value)}
                type="radio"
                name="status"
                value="cancelled"
              />
              Cancelled
            </label>
          </div>
          <div className="col-md-3 ">
            <h6>Trier par ordre</h6>
            <label>
              <input
                style={{ marginRight: 4, marginLeft: 4 }}
                onChange={(e) => setOrder(e.target.value)}
                type="radio"
                name="trierordre"
                value="1"
              />
              Croissant (A-Z)
            </label>
            <label>
              <input
                style={{ marginRight: 4, marginLeft: 4 }}
                onChange={(e) => setOrder(e.target.value)}
                type="radio"
                name="trierordre"
                value="-1"
              />
              Décroissant (Z-A)
            </label>
          </div>
          <div className="col-md-3 ">
            <button className="btn btn-secondary" onClick={() => filterData()}>
              Faire le tri
            </button>{" "}
          </div>
        </div>
      )}
      <div className="row p-2 mb-5">
        {commandes?.map((commande, index) => (
          <div className="col-md-4 col-lg-3 my-3 small-commande-card">
            <SmallCommandeCard
              key={index}
              width={"200px"}
              height={"180px"}
              commande={commande}
            />
            {!(
              commande.status === "completed" || commande.status === "cancelled"
            ) ? (
              <p className="icon">
                <span
                  className=" mx-2"
                  onClick={() => handleValidate(commande, "completed")}
                >
                  <FaCheck />{" "}
                </span>
                <span
                  className="mx-2"
                  onClick={() => handleValidate(commande, "cancelled")}
                >
                  <FaTrash />
                </span>
                {isLoading && <Loading />}
              </p>
            ) : (
              ""
            )}
          </div>
        ))}
        {commandes.length === 0 && (
          <h4 style={{ color: "gray", fontWeight: "bold", fontSize: "1rem" }}>
            Pas de commande
          </h4>
        )}
      </div>
    </div>
  );
};

export default CommandeClient;
