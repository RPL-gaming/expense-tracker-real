'use client'

import { useEffect, useState } from 'react'
import { getAppointments } from '../../../../utils/getAppointments'
import { AppointmentCard } from './AppointmentCard';

export interface Appointment {
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
          <AppointmentCard
            appointment={appointment}
            callback={() => getAppointments().then((res: any) => setAppointments(res ? res:[]))}
          />
        ))
        }
      </div>
    </section>
  )
}