"use client";

import React, { useState } from "react";
import Link from "next/link";
import {similarity} from "ml-distance";

type Advisor = {
  id: string;
  name: string;
  specialties: string[];
  email: string;
  ratePerHour: number;
  image: string;
  bio: string;
  yearsOfExperience: number;
  similarity: number;
};

const AdvisorPage = () => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAdvisors = async (userPrompt: string) => {
    try {
      setIsLoading(true);
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
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await fetchAdvisors(prompt);
  };

  return (
    <div className='pt-7 dark:bg-gray-900 px-5'>
      <div className="flex items-center flex-col mb-4">
        <div>
          <h2 className='text-3xl'>Search a Financial Advisor</h2>
        </div>
        <div className="flex flex-row gap-4 pt-4">
          <h2 className='text-center text-xl'>
            Tell us your preferences and financial goals
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-control">
    <textarea
        className="textarea textarea-bordered h-24"
        placeholder="I want to invest in stocks"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
    ></textarea>
        </div>
        <div className="flex justify-end mt-2"> {/* Flex container for right alignment and spacing */}
          <button type="submit" className="btn btn-primary">
            Find Advisors
          </button>
        </div>
      </form>

      {isLoading ? (
          <span className="loading loading-dots loading-md"></span>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {advisors.map((advisor) => {
              const similarity = Math.round(advisor.similarity * 100);
              return (
                  <div key={advisor.id} className="card bg-base-100 shadow-xl relative">
                    <div className="radial-progress bg-neutral-100 text-primary-content" style={{"--value": similarity,
                      position: 'absolute', top: '10px', right: '10px',"--thickness": "6px"}} role="progressbar" >
                      <div className="lg:tooltip" data-tip={`The advisor ${advisor.name} has a ${similarity}% match to your prompt.`}>{similarity}%
                      </div>
                    </div>

                    <figure>
                      <img src={advisor.image} alt={advisor.name} className="rounded-xl" />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{advisor.name}</h2>
                      <p><strong>Specialties:</strong> {advisor.specialties.join(', ')}</p>
                      <p><strong>Experience:</strong> {advisor.yearsOfExperience} years</p>
                      <p><strong>Rate:</strong> IDR {advisor.ratePerHour.toLocaleString("id-ID")} per hour</p>
                      <p>{advisor.bio}</p>
                      <div className="card-actions justify-end">
                        <Link href={`/advisor/${advisor.id}`}>
                         View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
      )}
    </div>
  );
};

export default AdvisorPage;
