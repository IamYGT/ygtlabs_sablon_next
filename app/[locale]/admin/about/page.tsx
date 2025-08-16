import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutPageClient } from "./components/AboutPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("About");
  const messages = {
    title: t("title"),
    description: t("description"),
    newAbout: t("newAbout"),
    contentTitle: t("contentTitle"),
    field: t("field"),
    content: t("content"),
    about: t("about"),
    mission: t("mission"),
    vision: t("vision"),
    roadmap: t("roadmap"),
    noContent: t("noContent"),
    noContentDescription: t("noContentDescription"),
    createFirstAbout: t("createFirstAbout"),
    loading: t("loading"),
    actions: {
      edit: t("actions.edit"),
      delete: t("actions.delete"),
      view: t("actions.view"),
    },
  };
  return <AboutPageClient messages={messages} />;
}
