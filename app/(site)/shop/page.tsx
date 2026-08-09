import { redirect } from "next/navigation";

// The catalogue is now collection-first. /shop lives on as a redirect so any
// old links/bookmarks land on the Collections page. Individual product detail
// pages remain at /shop/[slug] (linked from the Abaya collection).
export default function ShopPage() {
  redirect("/collections");
}
