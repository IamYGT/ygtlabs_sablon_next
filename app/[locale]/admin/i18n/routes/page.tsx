import { getTranslations } from "next-intl/server";
import RoutesClient from "./pageClient";

export default async function RoutesPage() {
  const t = await getTranslations("AdminI18n");
  return <RoutesClient title={t("routesEditor")} />;
}




