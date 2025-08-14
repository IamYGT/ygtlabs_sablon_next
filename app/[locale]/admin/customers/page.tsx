import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CustomersPageClient from "./components/CustomersPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AdminNavigation" });
  return {
    title: t("customers"),
    description: t("customers"),
  };
}

export default function CustomersPage() {
  return <CustomersPageClient />;
}

