"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AppointmentsAdd() {
  const [date, setDate] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/advisor/schedule/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dateTime: date
      }),
    });
    if (response.ok) {
      setIsSuccess(true);
      setTimeout(() => router.push("/appointments/view"), 1000);
    } else {
      setErrorMessages(["Failed to add schedule"]);
    }
  };

  return (
    <section className="bg-gray-900">
      {isSuccess && (
        <div
          className="absolute w-full p-4 mb-4 text-sm rounded-lg bg-gray-800 text-green-400"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> Schedule added.
        </div>
      )}
      {errorMessages.length > 0 && (
        <div
          className="p-4 mb-4 text-sm rounded-lg bg-gray-800 text-red-400"
          role="alert"
        >
          <span className="font-medium">Error alert!</span>{" "}
          {errorMessages.join(", ")}
        </div>
      )}
      <div className="flex flex-col w-full items-center justify-center py-8 px-4 mx-auto max-w-2xl h-full lg:py-20">
        <h2 className="mb-4 text-xl font-bold text-white">
          Add a New Appointment
        </h2>
        <form onSubmit={handleSubmit} className='flex flex-col items-center py-8'>
          <div className="flex items-center gap-4">
            <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-white"
            >
              Date
            </label>
            <input
              type="datetime-local"
              name="datetime"
              id="datetime"
              className="border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
              value={date}
              onChange={(event) => {
                setDate(event.target.value)
                console.log(event.target.value)
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-purple-700 rounded-lg focus:ring-4 focus:ring-purple-900 hover:bg-purple-800"
          >
            Add Appointment
          </button>
        </form>
      </div>
    </section>
  );
};
