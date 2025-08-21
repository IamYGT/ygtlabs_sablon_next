import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Next.js'in navigation API'lerini dil desteği ile sarar
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
