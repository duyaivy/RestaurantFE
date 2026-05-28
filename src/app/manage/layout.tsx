import DarkModeToggle from '@/shared/ui/dark-mode-toggle'
import DropdownAvatar from '@/app/manage/dropdown-avatar'
import NavLinks from '@/app/manage/nav-links'
import MobileNavLinks from '@/app/manage/mobile-nav-links'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <NavLinks />
        <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
          <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
            <MobileNavLinks />
            <div className='relative ml-auto flex-1 md:grow-0'>
              <div className='flex justify-end'>
                <DarkModeToggle />
              </div>
            </div>
            <DropdownAvatar />
          </header>
          {children}
        </div>
      </div>
    </NextIntlClientProvider>
  )
}
