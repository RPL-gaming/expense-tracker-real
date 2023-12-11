import Link from 'next/link'

export const NavbarAdvisor = () => {
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
    </div>
  )
}