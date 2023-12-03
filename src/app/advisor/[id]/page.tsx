"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Advisor = {
  id: string;
  name: string;
  specialties: string[];
  email: string;
  ratePerHour: number;
  bio: string;
  image: string;
  yearsOfExperience: number;
  availableSchedules: availableSchedules[];
};

type availableSchedules = {
  id: string;
  advisorId: string;
  dateTime: Date;
}

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
  const [selectedSchedule, setSelectedSchedule] = useState<availableSchedules | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const scheduleButtonText = selectedSchedule
      ? new Date(selectedSchedule.dateTime).toLocaleString("id-ID")
      : "Select Schedule";
  const [showModal, setShowModal] = useState(false);


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
          console.log(data)
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchAdvisor().catch((error) =>
      console.error("fetchAdvisor error:", error),
    );
  }, [id]);

  const handleSelectSchedule = (schedule: availableSchedules) => {
    setSelectedSchedule(schedule);
    setShowAlert(false);
  };

  const handlePay = async () => {
    if (!selectedSchedule) {
      setShowAlert(true);
      return;
    }
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
          advisorId: advisor?.id,
          advisorEmail: advisor?.email,
          advisorName: advisor?.name,
          schedule: selectedSchedule?.dateTime,
          scheduleId: selectedSchedule?.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMeetingDetails(data.meetingDetails);
        setShowModal(true);
      } else {
        console.error("Failed to create meeting");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const handleSuccessfulPayment = async (result: any) => {
    console.log("payment success", result);

    // Send a request to the backend to log the transaction
    try {
      const response = await fetch("/api/log/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: advisor?.ratePerHour,
          advisorId: advisor?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to log transaction");
      }

      handleCreateMeeting();
    } catch (error) {
      console.error("Error logging transaction:", error);
    }
  };

  useEffect(() => {
    if (transactionToken) {
      window.snap.pay(transactionToken, {
        onSuccess: handleSuccessfulPayment,
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
    return <div className="loading loading-dots loading-md"></div>;
  }

  return (
      <div className="p-5 flex flex-col md:flex-row">
        {advisor.image && (
            <figure className="md:w-1/3 px-10 pt-10">
              <img src={advisor.image} alt={advisor.name} className="rounded-xl max-w-full h-auto" />
            </figure>
        )}
        <div className="card bg-base-100 shadow-xl md:w-2/3">
          <div className="card-body">
            <h2 className="card-title">{advisor.name}</h2>
            <p>
              <strong>Specialties:</strong> {advisor.specialties.join(", ")}
            </p>
            <p>
              <strong>Experience:</strong> {advisor.yearsOfExperience} years
            </p>
            <p>
              <strong>Rate:</strong> IDR {advisor.ratePerHour.toLocaleString("id-ID")} per hour
            </p>
            <p>{advisor.bio}</p>

            <div className="divider"></div>

            {showAlert && (
                <div className="alert alert-info">
                  <div>
                    <span>Please select a schedule first.</span>
                  </div>
                </div>
            )}

            <div className="flex justify-between items-center">
              <div className="dropdown">
                <strong className="ml-2">Schedule</strong>
                <br></br>
                <div tabIndex={0} className="btn m-1">{scheduleButtonText}</div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  {advisor.availableSchedules.map((schedule, index) => (
                      <li key={index}>
                        <a onClick={() => handleSelectSchedule(schedule)}>
                          {new Date(schedule.dateTime).toLocaleString("id-ID")}
                        </a>
                      </li>
                  ))}
                </ul>
              </div>

              <button className="btn btn-primary" onClick={handlePay}>
                Book Appointment
              </button>
            </div>
          </div>

          {showModal && (
              <dialog className="modal" open>
                <div className="modal-box relative text-center p-8">
                  <h3 className="font-bold text-2xl mb-4 text-green-600">Confirmed!</h3>
                  <p className="text-lg font-semibold mb-2">Your Meeting Link</p>
                  <a
                      href={meetingDetails?.meetUrl || 'meet.google.com/abc-def-ghi'}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                    {meetingDetails?.meetUrl || 'meet.google.com/abc-def-ghi'}
                  </a>
                  <p className="my-4">
                    {new Date(selectedSchedule?.dateTime || '').toLocaleString("id-ID")}
                  </p>
                  <p className="mb-6">
                    This meeting has been added to your calendar
                  </p>
                  <Link href="/advisor">
                    <button
                        className="btn bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => {
                          setShowModal(false);

                        }}
                    >
                      Back to Find an Advisor
                    </button>
                  </Link>

                </div>
              </dialog>
          )}
        </div>
      </div>
  );
};

export default AdvisorDetailPage;
