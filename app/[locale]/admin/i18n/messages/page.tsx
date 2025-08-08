import { getTranslations } from "next-intl/server";
import MessagesClient from "./pageClient";

export default async function MessagesPage() {
  const t = await getTranslations("AdminI18n");
  return <MessagesClient title={t("messagesEditor")} />;
}




