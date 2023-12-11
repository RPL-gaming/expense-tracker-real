import React from "react";
import { Advisor } from "@/interfaces/advisor";

type AdvisorDetailsProps = {
  advisor: Advisor;
};

const AdvisorDetails: React.FC<AdvisorDetailsProps> = ({ advisor }) => {
  return (
    <>
      <h2 className="card-title">{advisor.name}</h2>
      <p>
        <strong>Specialties:</strong> {advisor.specialties.join(", ")}
      </p>
      <p>
        <strong>Experience:</strong> {advisor.yearsOfExperience} years
      </p>
      <p>
        <strong>Rate:</strong> IDR {advisor.ratePerHour.toLocaleString("id-ID")}{" "}
        per hour
      </p>
      <p>{advisor.bio}</p>
    </>
  );
};

export default AdvisorDetails;
