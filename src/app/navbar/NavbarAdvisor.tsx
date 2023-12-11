"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export const NavbarAdvisor = () => {
  const { logout } = useAuth();
  return (
    <div className="navbar bg-gray-800">
      <div className="navbar-start">
        <a className="hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2 text-xl">
          Spendwise
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 flex items-center gap-5">
          <Link href={"/appointments/view"}>
            <li className="hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2">
              Dashboard
            </li>
          </Link>
          <Link href={"/appointments/add"}>
            <li className="hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2">
              Add Appointment
            </li>
          </Link>
        </ul>
      </div>
      <div className="navbar-end"></div>
      <button
        className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800 mr-4"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};
