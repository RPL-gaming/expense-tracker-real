import { redirect } from "next/navigation";

export default function Home() {
  redirect("/expenses/view");
}
