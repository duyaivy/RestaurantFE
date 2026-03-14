'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { useRouter } from 'next/navigation'

export default function GuestLoginForm() {
  const router = useRouter()

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: '',
      tableNumber: 1
    }
  })

  const onSubmit = (data: GuestLoginBodyType) => {
    console.log('Fake login success')

    localStorage.setItem('accessToken', 'fake-token')

    router.push('/guest/menu')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🍜</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Đặt Món Online
          </h1>
          <p className="text-foreground/60 text-sm">
            Nhập tên để bắt đầu đặt món
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <label className="block text-foreground font-medium mb-2 text-sm">
                    Tên của bạn
                  </label>

                  <Input
                    {...field}
                    placeholder="Nhập tên"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-lg py-3 px-4"
                    autoFocus
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold rounded-lg text-base"
            >
              Vào cửa hàng
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-foreground/50 text-xs">
            © 2024 Cửa hàng đặt món. Tất cả quyền được bảo lưu.
          </p>
        </div>

      </div>
    </div>
  )
}