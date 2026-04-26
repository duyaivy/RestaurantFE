import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import GuestClientLayout from "./client-layout";

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <GuestClientLayout>{children}</GuestClientLayout>
    </NextIntlClientProvider>
  );
}
