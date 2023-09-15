import React from "react";
import classes from "./ServicesBackground.module.css";

export default function ServicesBackground(props) {
  return (
    <div className={classes["service-card-main-block"]}>{props.children}</div>
  );
}
