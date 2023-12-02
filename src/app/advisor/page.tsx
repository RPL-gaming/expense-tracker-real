"use client";

import React, { useState } from "react";
import Link from "next/link";

type Advisor = {
  id: string;
  name: string;
  similarity: number;
};

const AdvisorPage = () => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const fetchAdvisors = async (userPrompt: string) => {
    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setAdvisors(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await fetchAdvisors(prompt);
  };

  return (
    <div>
      <h1>Search Your Advisor</h1>
      <h2>Tell us your preferences and financial goals</h2>

      <form onSubmit={handleSubmit}>
        <label className="form-control">
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="I want to invest in stocks"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </label>
        <button type="submit" className="btn btn-primary">
          Find Advisors
        </button>
      </form>

      <ul>
        {advisors.map((advisor) => (
          <li key={advisor.id}>
            <Link href={`/advisor/${advisor.id}`}>
              {advisor.name} - Similarity: {advisor.similarity.toFixed(2)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvisorPage;
