import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../api";
import Loading from "../../components/loading/Loading";
import SmallCommandeCard from "../../components/profil/SmallCommandeCard";
import SmallCommentCard from "../../components/profil/SmallCommentCard";
import BigServiceDetailCardForDashoard from "../../components/service/BigServiceDetailCardForDashoard";
import Window from "../../components/window/Window";
import WindowForComment from "../../components/window/WindowForComment";
import { getToken, getUser } from "../../util";
import "./historique.scss";
const Historique = () => {
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [serverMessage, setServerMessage] = useState(null);
  const [historiques, setHistoriques] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [reloading, setReloading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedHistorique, setSelectedHistorique] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingHistorique, setloadinghistorique] = useState(false);
  const [sortby, setSortby] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [order, setOrder] = useState("");

  const user = getUser();
  const header = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      id: getUser()._id,
    },
  };
  const getHistoriques = async () => {
    await api
      .getHistorique(header)
      .then((res) => {
        console("Historiques", res.data);
        setHistoriques(res.data);
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

  const updateComment = async (comment) => {
    console.log("comment ", comment._id);
    const header = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        id: comment._id,
      },
    };
    const updatedCommentData = { ...comment, text: commentText };
    const tmp = selectedHistorique.comments.map((item) => {
      if (item._id === comment._id) {
        return { ...item, text: commentText };
      } else return item;
    });
    console.log("tmp  => ", tmp);
    setSelectedHistorique({
      ...selectedHistorique,
      comments: tmp,
    });
    try {
      if (commentText !== "")
        await api.updateComment(updatedCommentData, header);
      setReloading(!reloading);
    } catch (error) {
      console.log("Erreur lors de la mise à jour du commentaire", error);
    }
  };

  const deleteComment = async (comment) => {
    console.log("comment_id ", comment._id);
    console.log("selectedHistorique ", selectedHistorique);
    const tmp = selectedHistorique.comments.filter((item) => {
      console.log(" item._id ", item._id !== comment._id);
      if (item._id !== comment._id) return item;
    });
    setSelectedHistorique({
      ...selectedHistorique,
      comments: tmp,
    });
    console.log("tmp ====> ", tmp);
    setLoadingDelete(true);
    const header = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        id: comment._id,
      },
    };
    try {
      const res = await api.deleteComment(header);
      setReloading(!reloading);
      console.log(res);
      getCommandes();
    } catch (error) {
      console.log("Erreur lors de la suppression du commentaire", error);
    } finally {
      setLoadingDelete(false);
    }
  };
  const handleNewCommentSubmit = async (e, service) => {
    e.preventDefault();
    try {
      const res = await api.createHistorique(
        {
          comment: newComment,
          serviceId: service._id,
          userId: getUser()._id,
        },
        header
      );
      setNewComment("");
      setReloading(!reloading);
      console.log("historique => ", res);
      const hist = {
        ...selectedHistorique,
        comments: [...selectedHistorique.comments, res.data],
      };
      setSelectedHistorique(hist);
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({
        message: resolvedError?.data?.message,
        type: "error",
      });
      setServerMessageKey((prevKey) => prevKey + 1);
    }
  };
  const getCommandes = async () => {
    await api
      .getCommandesCustormer(header)
      .then((res) => {
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
      setloadinghistorique(true);
      getCommandes();
      getHistoriques();
    } catch (error) {
      console.log(error);
    } finally {
      setloadinghistorique(false);
    }
  }, [reloading, commentText, loadingDelete]);

  const extractComments = (serviceId) => {
    if (historiques) {
      var response = historiques.filter(
        (historique) => historique.serviceId._id === serviceId
      );
      setSelectedHistorique(response[0]);
    }
  };

  const filterData = async () => {
    try {
      setloadinghistorique(true);
      const response = await api.triCommande({
        headers: {
          Authorization: `Bearer ${getToken()}`,
          id: getUser()._id,
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
      setloadinghistorique(false);
    }
  };

  return (
    <div
      className="service-dashboard"
      style={{ height: "90vh", overflowY: "scroll" }}
    >
      {loadingHistorique && <Loading />}
      <p className="commandes">Mes historiques </p>
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
          <div className="col-md-4 col-lg-3 small-commande-card my-3">
            {!commande.serviceId && (
              <div
                style={{ color: "gray", fontWeight: "bold", fontSiz: "1rem" }}
              >
                {"Service supprimé"}{" "}
              </div>
            )}
            <SmallCommandeCard
              key={index}
              width={"200px"}
              height={"180px"}
              commande={commande}
            />
            <div className="icon">
              <WindowForComment
                showEditIcon={true}
                extractComments={extractComments}
                commande={commande}
              >
                <div className="row" style={{ margin: "5rem 0" }}>
                  <h4 className="subtitle-service">
                    Mes notes privées par service
                  </h4>
                  <p className="subtitle-service name-service">
                    {" "}
                    Service: {commande.serviceId &&
                      commande.serviceId.name}{" "}
                  </p>
                  <div class=" row content window-border">
                    {selectedHistorique &&
                      selectedHistorique.comments &&
                      selectedHistorique.comments.map((comment, key) => (
                        <div className="col-3" key={key}>
                          <SmallCommentCard
                            user={user}
                            commentText={commentText}
                            setCommentText={setCommentText}
                            dontShowService={true}
                            width={"200px"}
                            height={"180px"}
                            comment={comment}
                            setLoadingDelete={setLoadingDelete}
                            loadingDelete={loadingDelete}
                            updateComment={updateComment}
                            deleteComment={deleteComment}
                          />
                        </div>
                      ))}
                  </div>
                  <div className="row add-comment">
                    <form className="comment-form">
                      <textarea
                        type="text"
                        rows={3}
                        placeholder="Nouveau commentaire"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button
                        onClick={(e) =>
                          handleNewCommentSubmit(e, commande.serviceId)
                        }
                      >
                        Envoyer
                      </button>
                    </form>
                  </div>
                </div>
              </WindowForComment>
              <Window>
                {commande.serviceId ? (
                  <BigServiceDetailCardForDashoard
                    service={commande.serviceId}
                    width={"200px"}
                    height={"200px"}
                  />
                ) : (
                  <BigServiceDetailCardForDashoard
                    service={commande.saveService}
                    width={"200px"}
                    height={"200px"}
                  />
                )}
              </Window>
            </div>
            {loadingDelete ? <Loading /> : null}
          </div>
        ))}
        {commandes.length === 0 && (
          <h4 style={{ color: "gray", fontWeight: "bold", fontSize: "1rem" }}>
            Pas d'historique.
          </h4>
        )}
      </div>
    </div>
  );
};

export default Historique;
