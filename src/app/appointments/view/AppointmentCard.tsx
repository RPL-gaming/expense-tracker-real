"use client";

import { format } from "date-fns";
import { FaRegTrashAlt } from "react-icons/fa";
import { Appointment } from "./page";
import { deleteSchedule } from "../../../../utils/deleteSchedule";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const AppointmentCard = ({
  appointment,
  callback,
}: {
  appointment: Appointment;
  callback: () => void;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function deleteAppointment(id: string) {
    setLoading(true);
    await deleteSchedule(id);
    router.refresh();
    callback();
    setLoading(false);
  }

  return (
    <div className="w-[300px] relative p-4 bg-gray-700 rounded-xl">
      <p className="">
        {format(new Date(appointment.dateTime), "EEEE, d MMMM yyyy")}
      </p>
      <p className="opacity-75">
        {format(new Date(appointment.dateTime), "p")}
      </p>
      <button
        onClick={() => deleteAppointment(appointment.id)}
        className="absolute bottom-4 right-4 text-red-500"
      >
        {!loading ? (
          <FaRegTrashAlt />
        ) : (
          <span className="loading text-white scale-75 translate-y-2" />
        )}
      </button>
    </div>
  );
};
