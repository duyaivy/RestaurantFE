'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useForm } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useChangePasswordMutation } from '@/hooks/queries/useAccount'
import { toast } from '@/components/ui/use-toast'
import { handleErrorApi } from '@/lib/utils'

export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMutation()
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: ''
    }
  })
  const onSubmit = async (values: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return
    try {
      const res = await changePasswordMutation.mutateAsync(values)
      toast({
        description: res.payload.message,
      })
      form.reset()

    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })

    }
  }
  const reset = () => {
    form.reset()
  }

  return (
    <Form {...form}>
      <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8'
        onReset={reset}
        onSubmit={form.handleSubmit(onSubmit)}>
        <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='old_password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='old_password'>Mật khẩu cũ</Label>
                      <Input autoComplete='current-password' id='old_password' type='password' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='new_password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='new_password'>Mật khẩu mới</Label>
                      <Input autoComplete='new-password' id='new_password' type='password' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirm_password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='confirm_password'>Nhập lại mật khẩu mới</Label>
                      <Input autoComplete='new-password' id='confirm_password' type='password' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>Lưu thông tin</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
