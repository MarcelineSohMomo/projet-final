import { Fragment } from "react";
import { Link } from "react-router-dom";
import classes from "./LoginSignUpBtn.module.css";

const LoginSignUpBtn = () => {
  return (
    <Fragment>
      <div className={classes["btns-block"]}>
        <Link to="/signup" className={classes["singup-btn"]}>
          S’inscrire
        </Link>
        <Link to="/signin" className={classes["login-btn"]}>
          Se connecter
        </Link>
      </div>
    </Fragment>
  );
};

export default LoginSignUpBtn;
