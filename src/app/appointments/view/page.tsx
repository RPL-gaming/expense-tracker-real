'use client'

import { useEffect, useState } from 'react'
import { getAppointments } from '../../../../utils/getAppointments'
import { format } from 'date-fns'
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteSchedule } from '../../../../utils/deleteSchedule';

interface Appointment {
  id: string
  advisorId: string
  dateTime: string
}

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getAppointments()
    .then((res: any) => setAppointments(res ? res : []))
    .then(() => setLoading(false))
  }, [])

  async function deleteAppointment(id: string) {
    setLoading(true)
    await deleteSchedule(id)
    getAppointments().then((res: any) => setAppointments(res ? res : []))
    .then(() => setLoading(false))
  }

  return (
    <section className='flex flex-col py-20 items-center px-8'>
      <h1 className='text-3xl font-semibold'>
        Appointments
      </h1>
      <div className='pt-10 flex flex-wrap gap-10 justify-center'>
        {loading && 
          <span className='loading py-10' />
        }
        {appointments?.length == 0 && !loading &&
          <p>You haven't made any appointment</p>
        }
        {appointments?.map((appointment) => (
          <div className='w-[300px] relative p-4 bg-gray-700 rounded-xl'>
            <p className=''>
              {format(new Date(appointment.dateTime), 'EEEE, d MMMM yyyy')}
            </p>
            <p className='opacity-75'>
              {format(new Date(appointment.dateTime), 'p')}
            </p>
            <button
              onClick={() => deleteAppointment(appointment.id)}
              className='absolute bottom-4 right-4 text-red-500'
            >
              <FaRegTrashAlt />
            </button>
          </div>
        ))
        }
      </div>
    </section>
  )
}