export async function isAdvisor() {
  try {
    const res = await fetch('/api/auth/user')
    const data = await res.json()
    return data.isAdvisor
  } catch {
    return false
  }
}