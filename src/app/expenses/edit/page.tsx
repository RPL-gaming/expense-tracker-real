"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const EditExpensePage = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const expenseId: string = searchParams.get("id")!;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (category === "") {
      setErrorMessages(["Please select a category"]);
      return;
    }
    const expense = { amount, date, category, description };
    const response = await fetch(`/api/expenses/edit/${expenseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    console.log(response);
    if (response.ok) {
      setIsSuccess(true);
      setTimeout(() => router.back(), 1000);
    } else {
      setErrorMessages(["Failed to edit expense"]);
    }
  };

  async function fetchExpense(id: string) {
    try {
      const response = await fetch(`/api/expenses/get/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setAmount(data.amount);
        setDate(data.date);
        setCategory(data.category);
        setDescription(data.description);
      } else {
        alert("Failed to fetch expense.");
      }
      return response;
    } catch (error) {
      console.error("An error occurred while fetching expense:", error);
    }
  }

  useEffect(() => {
    fetchExpense(expenseId);
  }, []);

  return (
    <section className="bg-gray-900">
      {isSuccess && (
        <div
          className="absolute w-full p-4 mb-4 text-sm rounded-lg bg-gray-800 text-green-400"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> Expense edited.
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
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-20">
        <h2 className="mb-4 text-xl font-bold text-white">Edit an Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-white"
              >
                Category
              </label>
              <select
                id="category"
                className="border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">Select category</option>
                <option value="Utilities">Utilities</option>
                <option value="Food & Groceries">Food & Groceries</option>
                <option value="Transportation">Transportation</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div></div>
            <div className="w-full">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-white"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                className="border text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                placeholder="Rp 30000"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-white"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                className="border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                value={date.slice(0, 10)}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={8}
                className="block p-2.5 w-full text-sm rounded-lg border focus:ring-primary-500 focus:border-primary-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your description here"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-purple-700 rounded-lg focus:ring-4 focus:ring-purple-900 hover:bg-purple-800"
          >
            Edit Expense
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditExpensePage;
