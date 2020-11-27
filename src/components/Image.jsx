import React from "react";

const Image = (props) => {
  if (!!props.src) {
    return <img alt="" src={props.src} />;
  }
  return null;
};

export default Image;
