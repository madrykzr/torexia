import { redirect } from "next/navigation";

// Rent is temporarily disabled — will be brought back once ready.
// The real page lives at page.tsx.disabled (fully intact); rename it back
// and delete this stub to restore the section.
export default function RentProductPage() {
  redirect("/collections");
}
