"use client";
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function navbar () {
    const pathname = usePathname()

    const isLoginPage =  pathname === '/auth/login' ;
    const isRegisterPage = pathname === '/auth/register';

    // If on the login or register page, don't render the navbar
    if (isLoginPage || isRegisterPage) {
        return null;
    }


    return (
        <div className="navbar bg-gray-800">
        <div className="navbar-start">
            <a className="hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2 text-xl">Spendwise</a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 flex items-center gap-5">
            <Link href={'/expenses/view'} >
                <li className='hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2'>Dashboard</li>
            </Link>
            <Link href={'/expenses/add'} >
                <li className='hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2'>Add Expense</li>
            </Link>
            <Link href={'/budget'} >
                <li className='hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2'>Add Budget</li>
            </Link>
            <Link href={'/chat'} >
                <li className='hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2'>Talk to Wiza</li>
            </Link>
                <Link href={'/advisor'} >
                    <li className='hover:bg-gray-900 hover:rounded-lg transition duration-75 ease-linear px-4 py-2'>Find an Advisor</li>
                </Link>
            </ul>
        </div>
        <div className="navbar-end">
        </div>
    </div>
    )

}

export default navbar