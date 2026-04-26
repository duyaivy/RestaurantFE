import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
    // Read locale from a cookie
    const cookieStore = await cookies();
    const locale = cookieStore.get("app-locale")?.value || "vi";

    return {
        locale,
        messages: (await import(`@/shared/i18n/locales/${locale}.json`)).default,
    };
});
