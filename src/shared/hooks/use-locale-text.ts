"use client";

import { useLocale } from "@/shared/hooks/use-locale";
import { LocaleText } from "@/shared/i18n/locale.types";
import { resolveLocaleText } from "@/shared/lib/resolve-locale-text";

export function useLocaleText() {
    const locale = useLocale();

    return (text?: string | LocaleText | null) => resolveLocaleText(text, locale as "en" | "vi");
}
