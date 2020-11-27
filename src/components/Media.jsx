import React from "react";
import Image from "./Image";

const Media = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();

  let media;

  if (type === "image") {
    media = <Image src={src} />;
  }

  return media;
};

export default Media;
