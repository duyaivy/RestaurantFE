"use client";
import { Button } from "@/shared/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { LoginBody, LoginBodyType } from "@/features/auth/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/features/auth/hooks/use-auth";
import { toast } from "@/shared/ui/use-toast";
import { handleErrorApi } from "@/shared/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE } from "@/shared/constants/route";
import { useAppContext } from "@/shared/providers/app-provider";
import { useEffect } from "react";

export default function LoginForm() {
    const LoginMutation = useLoginMutation();
    const {setRole} = useAppContext();
    const searchParams =useSearchParams();
    const clearTokens = searchParams.get("clearTokens");
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const router = useRouter();
    useEffect   (() => { 
        if(clearTokens){
            setRole();
        }
       }, [clearTokens, setRole]);

    const onSubmit = async (data: LoginBodyType) => {
        if (LoginMutation.isPending) return;
        try {
            const result = await LoginMutation.mutateAsync(data);

            toast({
                description: result.payload.message,
            });
            router.push(ROUTE.MANAGE.DASHBOARD);
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: form.setError,
            });
        }
    };

    return (
        <Card className="mx-auto max-w-sm sm:max-w-md w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                <CardDescription>
                    Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                        noValidate
                        onSubmit={form.handleSubmit(onSubmit, (err) => {
                            console.warn(err);
                        })}
                    >
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button
                                isLoading={LoginMutation.isPending}
                                type="submit"
                                className="w-full"
                            >
                                Đăng nhập
                            </Button>
                            <Button variant="outline" className="w-full" type="button">
                                Đăng nhập bằng Google
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
