import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { defaultReview } from "../../components/two-side-form";
import SlideShow from "../../components/slide/SlideShow";
import api from "../../api";
import ServerMessage from "../../components/serverMessage/ServerMessage";
import { saveCurrentUserInfo } from "../../util";
import "./auth.scss";

const Signin = () => {
  const navigate = useNavigate();
  const data = {
    email: "",
    password: "",
  };

  const width = "col mx-3 ";
  const [formdata, setFormdata] = useState(data);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState(null);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formdata.email) newErrors.email = "Email is required";
    if (!formdata.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.id]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = showChangePassword
        ? await api.changepassword(formdata)
        : await api.signin(formdata);

      if (showChangePassword) {
        setServerMessage({
          message: response.data?.message,
          type: response.status === 200 ? "success" : "error",
        });
        setShowChangePassword(false);
      } else {
        saveCurrentUserInfo(response.data);
        navigate("/home");
      }
    } catch (error) {
      if (error.response.status === 406) {
        setShowChangePassword(true);
        setServerMessage({
          message: error.response?.data?.message,
          type: "error",
        });
        setServerMessageKey((prev) => prev + 1);
      } else {
        const resolvedError = await error.response;
        setServerMessage({
          message: resolvedError?.data?.message,
          type: "error",
        });
        setServerMessageKey((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row  justify-content-center align-items-center">
        <div
          className="col-md-6 justify-content-center align-items-center"
          style={{ padding: "0 5rem" }}
        >
          {serverMessage && (
            <ServerMessage
              message={serverMessage.message}
              type={serverMessage.type}
              key={serverMessageKey}
            />
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="m-3 h3">
                {" "}
                {showChangePassword
                  ? "Réinitialisez votre mot de passe avant de continuer"
                  : "Se connecter à EMM’S PRESTATION"}{" "}
              </div>
            </div>
            {showChangePassword ? (
              <>
                <div className={`form-group ${width}`}>
                  <label htmlFor="email" className="fw-bold">
                    Email
                  </label>
                  <input
                    value={formdata.email}
                    onChange={handleChange}
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                {/* ... */}
                <div className={`form-group ${width}`}>
                  <label htmlFor="password" className="fw-bold">
                    Mot de passe
                  </label>
                  <input
                    value={formdata.password}
                    onChange={handleChange}
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="form-row mx-3 d-flex my-3">
                  <button type="submit" className="signin-button">
                    Changer le mot de passe{" "}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={`form-group ${width}`}>
                  <label htmlFor="email" className="fw-bold">
                    Email
                  </label>
                  <input
                    value={formdata.email}
                    onChange={handleChange}
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                {/* ... */}
                <div className={`form-group ${width}`}>
                  <label htmlFor="password" className="fw-bold">
                    Mot de passe
                  </label>
                  <input
                    value={formdata.password}
                    onChange={handleChange}
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="form-row mx-3 d-flex my-3">
                  <button type="submit" className="signin-button">
                    Se connecter
                  </button>
                </div>
              </>
            )}
            <span className="mx-3 text-center ">
              Pas encore inscrit ?
              <Link
                to="/signup"
                className=" tw-text-primary tw-shadow-yellow-underline hover:tw-text-green-700 tw-cursor-pointer tw-visited:text-green-700"
              >
                {" "}
                Inscrivez-vous{" "}
              </Link>
            </span>
          </form>
        </div>

        <div className="col-md-6 p-0" style={{ height: "100vh" }}>
          <SlideShow default={1} reviews={defaultReview} />
        </div>
      </div>
    </div>
  );
};

export default Signin;
