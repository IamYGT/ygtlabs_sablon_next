import { routing } from "@/lib/i18n/routing";
import { redirect } from "next/navigation";

export default function RootPage() {
  // Varsayılan locale'e yönlendir
  redirect(`/${routing.defaultLocale}`);
}
