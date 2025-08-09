"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { routing } from "@/src/i18n/routing";
import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
// Bayrak ikonları için SVG importları
import TR from "country-flag-icons/react/3x2/TR";
import US from "country-flag-icons/react/3x2/US";
import useSWR from "swr";

interface LanguageSwitcherProps {
  isAdmin?: boolean;
}

export default function LanguageSwitcher({
  isAdmin: _isAdmin = false,
}: LanguageSwitcherProps) {
  const t = useTranslations("Language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSWR("/api/admin/i18n/languages", (url: string) =>
    fetch(url).then((r) => r.json())
  );

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  const getLanguageName = (locale: string) => {
    switch (locale) {
      case "tr":
        return t("turkish");
      case "en":
        return t("english");
      default:
        return locale.toUpperCase();
    }
  };

  const getLanguageFlag = (locale: string) => {
    switch (locale) {
      case "tr":
        return <TR className="w-5 h-4 rounded-sm shadow-sm" />;
      case "en":
        return <US className="w-5 h-4 rounded-sm shadow-sm" />;
      default:
        return <Languages className="w-4 h-4" />;
    }
  };

  const getCurrentFlag = () => {
    return getLanguageFlag(locale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative transition-all duration-200 hover:scale-105 hover:bg-accent/50 rounded-lg h-9 w-9 group"
          title={t("changeLanguage")}
        >
          <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            {getCurrentFlag()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center border border-border/30 shadow-sm">
            <Languages className="h-2 w-2 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 border-border/60 shadow-xl backdrop-blur-sm"
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t("selectLanguage")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(routing.locales as readonly string[])
          .filter((loc) =>
            (data?.languages ?? []).some(
              (l: { code: string; isActive?: boolean }) => l.code === loc
            )
          )
          .map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              className={`transition-all duration-200 cursor-pointer flex items-center justify-between px-3 py-2.5 ${
                locale === loc
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                  : "hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center gap-3">
                {getLanguageFlag(loc)}
                <span className="font-medium">{getLanguageName(loc)}</span>
              </div>
              {locale === loc && (
                <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
