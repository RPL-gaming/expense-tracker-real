"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chart } from "react-google-charts";

interface Expense {
  id: number;
  amount: number;
  date: string;
  category: string;
  description: string;
  userId: number;
}

interface Budget {
  id: number;
  amount: number;
  date: string;
  userId: number;
  user: number;
}

function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudgets] = useState<Budget | null>(null);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const router = useRouter();
  async function fetchExpenses() {
    try {
      const response = await fetch("/api/view", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses);
        setBudgets(data.budget);
        setTotalExpense(data.totalExpenseAmount);
      } else {
        console.error(
          "Failed to fetch expenses:",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching expenses:", error);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Function to generate pie chart data from expenses
  const generatePieChartData = () => {
    const categories = Array.from(
      new Set(expenses.map((expense) => expense.category)),
    );
    const data: Array<[any, any]> = [["Category", "Amount"]];

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const categoryExpenses = expenses.filter(
        (expense) => expense.category === category,
      );
      const categoryTotal = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      data.push([category, categoryTotal]);
    }
    return data;
  };

  return (
    <div className="pt-7 dark:bg-gray-900 px-5">
      <div className="flex items-center flex-col mb-4">
        <div>
          <h2 className="text-3xl">Expense List</h2>
        </div>
        <div className="flex flex-row gap-4 pt-4">
          <h2 className="text-center text-xl">
            Budget: Rp {budget ? budget.amount : 0}
          </h2>
          <h2 className="text-center text-xl">
            Total Expense: Rp {totalExpense}
          </h2>
          <h2 className="text-center text-xl">
            Left : Rp {budget ? budget.amount - totalExpense : 0 - totalExpense}
          </h2>
        </div>
      </div>
      <div className="overflow-x-auto dark:bg-gray-800 rounded-lg">
        <Chart
          chartType="PieChart"
          data={generatePieChartData()}
          width={"100%"}
          height={"400px"}
          options={{
            backgroundColor: "transparent",
            legend: {
              textStyle: {
                color: "white",
              },
            },
          }}
        />
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th className="text-xl text-white">Amount</th>
              <th className="text-xl text-white">Category</th>
              <th className="text-xl text-white">Date</th>
              <th className="text-xl text-white">Description</th>
              <th className="text-xl text-white">Update</th>
            </tr>
          </thead>
          <tbody>
            {!!expenses &&
              expenses.map((expense, index) => (
                <tr key={expense.id} className="hover">
                  <th>{index + 1}</th>
                  <td className="text-lg">Rp {expense.amount}</td>
                  <td className="text-lg">{expense.category}</td>
                  <td className="text-lg">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-lg">{expense.description}</td>
                  <td>
                    <div className="">
                      <button
                        className="text-white bg-purple-700 w-24 h-12 rounded-xl"
                        onClick={() =>
                          router.push(`/expenses/edit?id=${expense.id}`)
                        }
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;
