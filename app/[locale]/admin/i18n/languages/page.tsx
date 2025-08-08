import { getTranslations } from "next-intl/server";
import LanguagesClient from "./pageClient";

export default async function LanguagesPage() {
  const t = await getTranslations("AdminI18n");
  return <LanguagesClient title={t("languages")} />;
}




