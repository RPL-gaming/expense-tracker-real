"use client";
import React, { useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [name, setName] = useState("");
  const [specialities, setSpecialities] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [ratePerHour, setRatePerHour] = useState(0);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleUserTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setIsAdvisor(event.target.value === "Financial Advisor");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSpecialitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSpecialities(event.target.value);
  };

  const handleRatePerHourChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRatePerHour(parseFloat(event.target.value));
  };

  const handleYearsOfExperienceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setYearsOfExperience(parseInt(event.target.value, 10));
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setImage(event.target.value);
  };
  
  const handleBioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBio(event.target.value);
  };

  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
        isAdvisor,
        name,
        specialities,
        ratePerHour,
        yearsOfExperience,
        image,
        bio
      }),
    });
    console.log(response);
    if (response.ok) {
      setIsRegisterSuccess(true);
      // delay redirect to allow for success alert to show
      setTimeout(() => (window.location.href = "/auth/login"), 1000);
    } else {
      const data = await response.json();
      setIsRegisterSuccess(false);
      setErrorMessage(data.error);
    }
  };

  return (
    <section className="bg-gray-900">
      {isRegisterSuccess && (
        <div
          className="p-4 mb-4 text-sm rounded-lg bg-gray-800 text-green-400"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> You are now
          registered.
        </div>
      )}
      {errorMessage && (
        <div
          className="p-4 mb-4 text-sm rounded-lg bg-gray-800 text-red-400"
          role="alert"
        >
          <span className="font-medium">Error!</span> {errorMessage}
        </div>
      )}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:min-h-screen">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-white"
        >
          <img className="w-16 h-16 mr-2" src="/images/spendwise-logo.webp" />
          Spendwise
        </a>
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              Register an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  username
                </label>
                <input
                  value={username}
                  onChange={handleUsernameChange}
                  type="text"
                  name="username"
                  id="username"
                  className=" border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your email
                </label>
                <input
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  name="email"
                  id="email"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="userType"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  User Type
                </label>
                <div className="relative">
                  <select
                    value={isAdvisor ? "Financial Advisor" : "User"}
                    onChange={handleUserTypeChange}
                    name="userType"
                    id="userType"
                    className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 appearance-none hover:cursor-pointer bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="User">User</option>
                    <option value="Financial Advisor">Financial Advisor</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {isAdvisor && (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Name
                    </label>
                    <input
                      value={name}
                      onChange={handleNameChange}
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your Name"
                      className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="specialities"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Specialities (separate with comma)
                    </label>
                    <input
                      value={specialities}
                      onChange={handleSpecialitiesChange}
                      type="text"
                      name="specialities"
                      id="specialities"
                      placeholder="Stocks, Money Market, Debt"
                      className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ratePerHour"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Rate per Hour
                    </label>
                    <input
                      value={ratePerHour}
                      onChange={handleRatePerHourChange}
                      type="number"
                      name="ratePerHour"
                      id="ratePerHour"
                      placeholder="1000,00"
                      className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="yearsOfExperience"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Years of Experience
                    </label>
                    <input
                      value={yearsOfExperience}
                      onChange={handleYearsOfExperienceChange}
                      type="number"
                      name="yearsOfExperience"
                      id="yearsOfExperience"
                      placeholder="10"
                      className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="image"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Profile Image
                    </label>
                    <input
                      value={image}
                      onChange={handleImageChange}
                      type="text"
                      name="image"
                      id="image"
                      placeholder="https://to-image"
                      className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="bio"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Bio
                    </label>
                    <input
                      value={bio}
                      onChange={handleBioChange}
                      type="text"
                      name="bio"
                      id="bio"
                      placeholder="I am an expert in stock market"
                      className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
              >
                Sign Up
              </button>
              <p className="text-sm font-light text-gray-400">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="font-medium text-primary-600 hover:underline text-primary-500"
                >
                  Sign In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
