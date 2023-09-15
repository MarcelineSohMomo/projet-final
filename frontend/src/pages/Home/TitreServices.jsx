import React from "react";
import classes from "./TitreServices.module.css";

export default function TitreServices(props) {
  let { main_title, span, custom_color } = props;

  let specific_color = {
    color: `${custom_color}`,
  };

  return (
    <h1 className={classes["title"]}>
      {main_title}{" "}
      <span style={specific_color} className={classes["span-title"]}>
        {span}
      </span>
    </h1>
  );
}
