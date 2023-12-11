"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SetBudgetForm = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const router = useRouter();

  const handleSetBudget = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const budget = { amount, date };
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budget),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => router.back(), 1000);
      } else {
        setErrorMessages(["Failed to add expense"]);
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <section className="bg-gray-900">
      {isSuccess && (
        <div
          className="absolute w-full p-4 mb-4 text-sm rounded-lg bg-gray-800 text-green-400"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> Expense added.
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
      <div className="flex flex-col items-center justify-center px-6 py-40 mx-auto">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              Create Budget
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSetBudget}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Amount
                </label>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  type="number"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Date
                </label>
                <input
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  type="date"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 bg-purple-700"
              >
                Add Budget
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetBudgetForm;
