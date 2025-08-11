import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import InformationPageClient from "./components/InformationPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AdminNavigation" });
  return {
    title: t("information"),
    description: t("information"),
  };
}

export default function InformationPage() {
  return <InformationPageClient />;
}
