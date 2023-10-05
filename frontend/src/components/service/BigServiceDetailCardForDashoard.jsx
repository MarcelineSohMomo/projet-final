import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import {
  FaCheck,
  FaEdit,
  FaFacebookMessenger,
  FaHeart,
  FaHistory,
  FaPhone,
  FaStar,
} from "react-icons/fa";
import { Navigate, useParams } from "react-router-dom";
import api from "../../api";
import { extractDate, getToken, getUser, verifyTabString } from "../../util";
import VerifyAuth from "../VerifyAuth/VerifyAuth";
import "./service.scss";
import SmallCommentCard from "../profil/SmallCommentCard";
import Loading from "../loading/Loading";
import UserProfileCard from "../profil/UserProfileCard";
import Stars from "../favorite/Stars";
import SmallNoteCard from "../profil/SmallNoteCard";
import FavoriteUpdate from "../favorite/FavoriteUpdate";
import ServerMessage from "../serverMessage/ServerMessage";
import AvailabilityList from "../AvailableForm/AvailableList";

function BigServiceDetailCardForDashoard({
  dontModifyFavorite,
  service,
  width,
  height,
}) {
  // const [user, setUser] = useState(null);
  const isconnected = localStorage.getItem("isconnected");
  const { id } = useParams();
  const [total, setTotal] = useState(0);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [serverMessage, setServerMessage] = useState(null);
  const [reloading, setReloading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentText, setCommentText] = useState("");
  const [noteHasChanged, setNoteHasChanged] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const headers = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      id: id,
    },
  };

  useEffect(() => {
    // }, [id]);
  }, [id, newComment, reloading, noteHasChanged]);

  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    const header = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      const res = await api.postComment(
        {
          text: newComment,
          serviceId: service._id,
          commenterId: getUser()._id,
        },
        header
      );
      setNewComment("");
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({
        message: resolvedError?.data?.message,
        type: "error",
      });
      setServerMessageKey((prevKey) => prevKey + 1);
    }
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
    try {
      if (commentText !== "")
        await api.updateComment(updatedCommentData, header);
      setReloading(!reloading);
    } catch (error) {
      console.log("Erreur lors de la mise à jour du commentaire", error);
    }
  };

  const deleteComment = async (comment) => {
    const header = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        id: comment._id,
      },
    };
    try {
      await api.deleteComment(header);
      setReloading(!reloading);
    } catch (error) {
      console.log("Erreur lors de la suppression du commentaire", error);
    }
  };

  const handleSubmitOrder = async () => {
    const newCommande = {
      serviceId: service._id,
      provider: service.providerId._id,
      name: service.name,
      customer: getUser()._id,
      price: total,
      status: "pending",
    };
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const response = await api.createCommande(newCommande, headers);
      setServerMessageKey((prevKey) => prevKey + 1);
      setServerMessage({
        message: response.data.message,
        type: "success",
      });
    } catch (error) {
      const resolvedError = error.response;
      setServerMessage({
        message: resolvedError?.data?.message,
        type: "error",
      });
      setServerMessageKey((prevKey) => prevKey + 1);
      console.log(error);
    }
  };
  const handleAdd = (tarif) => {
    setTotal(total + Number(tarif.quantite.slice(0, -1)));
  };

  const handleRemove = (tarif) => {
    if (total > 0) setTotal(total - Number(tarif.quantite.slice(0, -1)));
  };

  const checkboxStyle = {
    display: "inline-block",
    border: "0",
    backgroundColor: "red !important",
  };

  const handleCheckboxChange = (e, tarif) => {
    setIsChecked(!isChecked);
    if (e.target.checked) {
      console.log(tarif.quantite);
      handleAdd(tarif);
    } else {
      handleRemove(tarif);
    }
  };
  console.log("service in bigSerciceDetailCard ", service.others);
  return (
    <VerifyAuth>
      {!service ? (
        <Loading />
      ) : (
        <Container style={{ height: "80vh !important", overflow: "scroll" }}>
          {serverMessage && (
            <ServerMessage
              message={serverMessage.message}
              type={serverMessage.type}
              key={serverMessageKey}
            />
          )}
          <div className="content big-service-detail-card m-4 p-3">
            <div class="row">
              <div className="col-3">
                <div className="row">
                  <Carousel>
                    {service && service.imgs && service.imgs.length > 0 ? (
                      service.imgs.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100 rounded"
                            src={`http://localhost:5000/${image}`}
                            width={width}
                            height={height}
                            alt={`slide ${index}`}
                          />
                        </Carousel.Item>
                      ))
                    ) : (
                      <div
                        className="no-content"
                        style={{ width: `${width}`, height: `${height}` }}
                      >
                        No Content
                      </div>
                    )}
                  </Carousel>
                </div>
                <div className="row " style={{ padding: ".9rem" }}>
                  <UserProfileCard user={service.providerId} />
                </div>
              </div>
              <div className="col-9">
                <div className="row">
                  <div className="col name center-name">
                    <span>{service.name}</span>
                    <span className="stars">
                      <Stars service={service} />{" "}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-9">
                    <div className="categorie">
                      <span>Catégorie : </span>
                      <span>
                        {service.categorie &&
                          service.categorie.name &&
                          service.categorie.name.toUpperCase()}{" "}
                      </span>
                    </div>
                    {service.keywords && (
                      <div className="categorie">
                        <p>
                          Mots clés:{" "}
                          {service.keywords
                            .split(",")
                            .map((word, index) =>
                              service.keywords.split(",").length - 1 === index
                                ? word.trim()
                                : `${word.trim()}, `
                            )}
                        </p>
                      </div>
                    )}
                    <div className="description-service">
                      {service.description}
                    </div>
                    <div className="formule-card">
                      <span>Formule</span>
                      <div className="row tarification">
                        {service.tarification.map((tarif, key) => (
                          <div className="offre" key={key}>
                            <span className="formule">{tarif.prix} : </span>
                            <span className="prix">{tarif.quantite} </span>
                            <input
                              class="checkbox"
                              type="checkbox"
                              id={key}
                              style={checkboxStyle}
                              onChange={(e) => {
                                handleCheckboxChange(e, tarif);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-3 qualification">
                    <span>Depuis le</span>
                    <div className="Row">
                      <div className="col">
                        <p className="date-creation">
                          {" "}
                          <FaHistory
                            style={{ color: "gray", fontSize: "10px" }}
                          />{" "}
                          <span>{extractDate(service.createdAt)} </span>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="Row my-3">
                      <div className="col">
                        <p className="contacter-fournisseur">
                          {" "}
                          <FaFacebookMessenger
                            style={{ color: "gray", fontSize: "10px" }}
                          />{" "}
                          <span> Ecrire au fournisseur</span>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="Row my-3">
                      <div className="col">
                        <p className="laisser-commentaire">
                          {" "}
                          <FaEdit
                            style={{ color: "gray", fontSize: "10px" }}
                          />{" "}
                          <span> Laisser un commentaire</span>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="Row my-3">
                      <div className="col">
                        <p
                          onClick={(e) => handleSubmitOrder()}
                          className=" laisser-commentaire faire-commande"
                        >
                          <FaCheck
                            style={{ color: "gray", fontSize: "10px" }}
                          />{" "}
                          <span> Lancer une commande</span>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="Row my-3">
                      <div className="col">
                        <p
                          style={{ color: "gray", fontSize: "10px" }}
                          className=" laisser-commentaire faire-commande"
                        >
                          {service.others}
                        </p>
                      </div>
                    </div>
                    <AvailabilityList availabilities={service.availability} />
                  </div>
                </div>
              </div>
            </div>
            <FavoriteUpdate
              dontModifyFavorite={dontModifyFavorite}
              noteHasChanged={noteHasChanged}
              setNoteHasChanged={setNoteHasChanged}
              service={service}
            />
            {!verifyTabString(service.listnotes) && (
              <div className="row" style={{ margin: "5rem 0" }}>
                <h4 className="subtitle-service">Notes obtenues</h4>
                <div class=" row">
                  {service.listnotes.map((note, key) => (
                    <div className="col-3">
                      <SmallNoteCard
                        service={service}
                        width={"200px"}
                        height={"180px"}
                        note={note}
                        user={note.userId}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!verifyTabString(service.listcomments) && (
              <div className="row" style={{ margin: "5rem 0" }}>
                <h4 className="subtitle-service">Liste des commentaires</h4>
                <div class=" row">
                  {service.listcomments.map((comment, key) => (
                    <div className="col-3">
                      <SmallCommentCard
                        commentText={commentText}
                        setCommentText={setCommentText}
                        dontShowService={true}
                        service={service}
                        width={"200px"}
                        height={"180px"}
                        comment={comment}
                        updateComment={updateComment}
                        deleteComment={deleteComment}
                        user={service.providerId}
                      />
                    </div>
                  ))}
                </div>
                <div className="row add-comment">
                  <form className="comment-form">
                    <textarea
                      type="text"
                      rows={2}
                      placeholder="Nouveau commentaire"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleNewCommentSubmit}>Envoyer</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </Container>
      )}
    </VerifyAuth>
  );
}

export default BigServiceDetailCardForDashoard;
