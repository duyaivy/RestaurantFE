import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import PublicLayoutShell from './public-layout-shell';

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <PublicLayoutShell>{children}</PublicLayoutShell>
    </NextIntlClientProvider>
  )
}
