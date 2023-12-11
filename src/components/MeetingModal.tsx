import React from "react";
import { MeetingDetails, AvailableSchedules } from "@/interfaces/advisor";
import Link from "next/link";

type MeetingModalProps = {
  meetingDetails: MeetingDetails | null;
  selectedSchedule: AvailableSchedules | null;
};

const MeetingModal: React.FC<MeetingModalProps> = ({
  meetingDetails,
  selectedSchedule,
}) => {
  if (!meetingDetails) return null;

  return (
    <dialog className="modal" open>
      <div className="modal-box relative text-center p-8">
        <h3 className="font-bold text-2xl mb-4 text-green-600">Confirmed!</h3>
        <p className="text-lg font-semibold mb-2">Your Meeting Link</p>
        <a
          href={meetingDetails.meetUrl}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {meetingDetails.meetUrl}
        </a>
        <p className="my-4">
          {selectedSchedule &&
            new Date(selectedSchedule.dateTime).toLocaleString("id-ID")}
        </p>
        <p className="mb-6">This meeting has been added to your calendar</p>
        <Link href="/advisor">
          <button className="btn btn-primary rounded-full">
            Back to Find an Advisor
          </button>
        </Link>
      </div>
    </dialog>
  );
};

export default MeetingModal;
