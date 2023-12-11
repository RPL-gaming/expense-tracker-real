"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Advisor,
  MeetingDetails,
  AvailableSchedules,
} from "@/interfaces/advisor";
import AdvisorDetails from "@/components/AdvisorDetails";
import ScheduleDropdown from "@/components/ScheduleDropdown";
import MeetingModal from "@/components/MeetingModal";
import AdvisorImage from "@/components/AdvisorImage";
import FailedModal from "@/components/FailedModal";
import LoadingModal from "@/components/LoadingModal";

const AdvisorDetailPage = () => {
  const router = usePathname();
  const id = router.split("/").at(-1);
  const [advisor, setAdvisor] = useState<Advisor | null>();
  const [transactionToken, setTransactionToken] = useState<string>("");
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(
    null,
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<AvailableSchedules | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);

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

  const handleSelectSchedule = (schedule: AvailableSchedules) => {
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
    setIsCreatingMeeting(true);
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
      } else {
        console.error("Failed to create meeting");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    } finally {
      setIsCreatingMeeting(false);
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
          setPaymentFailed(true);
          console.log("payment error", result);
        },
        onClose: function () {
          setPaymentFailed(true);
        },
      });
    }
  }, [transactionToken]);

  const handleCloseModal = () => {
    setPaymentFailed(false);
  };

  if (!advisor) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col md:flex-row bg-gray-900">
      {advisor.image && (
        <AdvisorImage image={advisor.image} name={advisor.name} />
      )}
      <div className="card bg-base-100 shadow-xl md:w-2/3">
        <div className="card-body">
          <AdvisorDetails advisor={advisor} />
          <div className="divider"></div>
          {showAlert && (
            <div className="alert alert-info">
              <div>
                <span>Please select a schedule first.</span>
              </div>
            </div>
          )}
          <ScheduleDropdown
            availableSchedules={advisor.availableSchedules}
            onSelectSchedule={handleSelectSchedule}
            scheduleButtonText={
              selectedSchedule
                ? new Date(selectedSchedule.dateTime).toLocaleString("id-ID")
                : "Select Schedule"
            }
          />
          <button className="btn btn-primary" onClick={handlePay}>
            Book Appointment
          </button>
        </div>
      </div>
      {meetingDetails && (
        <MeetingModal
          meetingDetails={meetingDetails}
          selectedSchedule={selectedSchedule}
        />
      )}
      {paymentFailed && <FailedModal onClose={handleCloseModal} />}
      {isCreatingMeeting && <LoadingModal />}
    </div>
  );
};

export default AdvisorDetailPage;
