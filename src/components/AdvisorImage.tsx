import React from "react";

type Props = {
  image: string;
  name: string;
};

const AdvisorImage: React.FC<Props> = ({ image, name }) => {
  return (
    <figure className="md:w-1/3 px-10 pt-10">
      <img src={image} alt={name} className="rounded-xl max-w-full h-auto" />
    </figure>
  );
};

export default AdvisorImage;
