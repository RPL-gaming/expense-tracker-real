export async function getAppointments() {
  try {
    const res = await fetch('/api/advisor/schedule/get')
    const data = await res.json()
    if (data.length >= 0) {
      return data
    }
    return []
  } catch {
    return []
  }
}