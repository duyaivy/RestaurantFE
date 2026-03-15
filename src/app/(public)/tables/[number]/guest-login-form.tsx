'use client'

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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── BG IMAGE ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/d1/15/2e/d1152e0a678aa2f5f27b3b5a2c87bd4f.jpg')"
        }}
      />
      <div className="absolute inset-0 bg-[rgba(6,4,2,0.62)]" />

      {/* ── BRANDING ── */}
      <div className="absolute top-16 left-0 right-0 flex flex-col items-center gap-2 z-10">
        <h1 className="text-[26px] font-extralight text-white tracking-[0.3em] uppercase">
          Fine Dining
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-5 h-px bg-amber-500/60" />
          <div className="w-1 h-1 rounded-full bg-amber-500" />
          <div className="w-5 h-px bg-amber-500/60" />
        </div>
        <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase">Phục vụ tận tâm</p>
      </div>

      {/* ── GLASS CARD CENTER ── */}
      <div className="relative z-10 w-full max-w-[327px] mx-auto bg-[rgba(12,8,3,0.1)] backdrop-blur-sm border border-amber-500/20 rounded-3xl px-6 py-7">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <label className="block text-[10px] text-white/30 tracking-[0.25em] uppercase mb-2">
                    Nhập tên để tiếp tục
                  </label>
                  <input
                    {...field}
                    placeholder="Tên của bạn..."
                    autoFocus
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-[14px] text-[15px] text-[#f2ece0] placeholder:text-white/20 outline-none focus:border-amber-500/50 focus:bg-white/[0.09] transition-all"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] transition-all duration-150 rounded-xl py-[15px] text-[15px] font-bold text-[#0c0a06] tracking-wide shadow-[0_4px_22px_rgba(201,160,48,0.32)]"
            >
              Vào cửa hàng →
            </button>

          </form>
        </Form>

        <p className="text-center mt-4 text-[11px] text-white/15">
          © 2025 Fine Dining
        </p>
      </div>

    </div>
  )
}