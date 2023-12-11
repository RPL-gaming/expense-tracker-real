export async function deleteSchedule(id: string) {
  try {
    await fetch("/api/advisor/schedule/delete", {
      method: "DELETE",
      body: JSON.stringify({
        id,
      }),
    });
  } catch {
    return;
  }
}
