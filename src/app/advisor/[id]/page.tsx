"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Advisor = {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  ratePerHour: number;
};

type MeetingDetails = {
  meetUrl: string;
};

const AdvisorDetailPage = () => {
  const router = usePathname();
  const id = router.split("/").at(-1);
  const [advisor, setAdvisor] = useState<Advisor | null>();
  const [transactionToken, setTransactionToken] = useState<string>("");
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(
    null,
  );

  useEffect(() => {
    const fetchAdvisor = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/advisor/${id}`);
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data = await response.json();
          setAdvisor(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchAdvisor().catch((error) =>
      console.error("fetchAdvisor error:", error),
    );
  }, [id]);

  const handlePay = async () => {
    try {
      const response = await fetch("/api/midtrans", {
        method: "POST",
        body: JSON.stringify({ gross_amount: advisor?.ratePerHour }),
      });
      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }
      const data = await response.json();
      setTransactionToken(data.token);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      const response = await fetch("/api/meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          advisorEmail: advisor?.email,
          advisorName: advisor?.name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMeetingDetails(data.meetingDetails);
      } else {
        console.error("Failed to create meeting");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  useEffect(() => {
    if (transactionToken) {
      window.snap.pay(transactionToken, {
        onSuccess: function (result: any) {
          console.log("payment success", result);
          handleCreateMeeting();
        },
        onPending: function (result: any) {
          console.log("payment pending", result);
        },
        onError: function (result: any) {
          console.log("payment error", result);
        },
        onClose: function () {
          console.log(
            "customer closed the popup without finishing the payment",
          );
        },
      });
    }
  }, [transactionToken]);

  if (!advisor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {meetingDetails && <div>Meeting URL: {meetingDetails.meetUrl}</div>}
      <h1>Id: {id}</h1>
      <h1>{advisor.name}</h1>
      <h1>{advisor.email}</h1>
      {advisor.specialties.map((specialty, index) => (
        <h2 key={index}>{specialty}</h2>
      ))}
      <h1>Rp.{advisor.ratePerHour}</h1>
      <button className="btn btn-primary" onClick={handlePay}>
        Book Appointment
      </button>
    </div>
  );
};

export default AdvisorDetailPage;
