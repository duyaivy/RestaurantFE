"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/features/guest/schemas/guest.schema";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { bgGuestLogin } from "public";
import { useGuestLoginMutation } from "@/features/guest/hooks/use-guest";
import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/ui/use-toast";
import { ROUTE } from "@/shared/constants/route";
import { useTranslations } from "next-intl";

export default function GuestLoginForm() {
  const t = useTranslations("auth");
  const landingT = useTranslations("landing");
  const router = useRouter();
  const params = useParams<{ number: string }>();
  const searchParams = useSearchParams();
  const { mutateAsync: guestLogin, isPending: isGuestLoginPending } =
    useGuestLoginMutation();

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      tableToken: searchParams.get("token") || "",
      tableNumber: Number(params.number),
    },
  });

  const onSubmit = async (data: GuestLoginBodyType) => {
    try {
      const result = await guestLogin(data);

      // save
      localStorage.setItem("accessToken", result.payload.data.accessToken);
      localStorage.setItem("guestName", data.name);
      localStorage.setItem("table_number_id", data.tableNumber.toString());

      toast({
        title: t("loginSuccessTitle"),
        description: result.payload.message,
      });
      router.push(ROUTE.GUEST.MENU);
    } catch (error: any) {
      toast({
        title: t("loginErrorTitle"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgGuestLogin.src})`,
        }}
      />
      <div className="absolute inset-0 bg-[rgba(6,4,2,0.62)]" />

      <div className="absolute top-16 left-0 right-0 flex flex-col text-white items-center gap-2 z-10">
        <h1 className="text-[26px] font-extralight text-white tracking-[0.3em] uppercase">
          Fine Dining
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-5 h-px bg-amber-500/60" />
          <div className="w-1 h-1 rounded-full bg-amber-500" />
          <div className="w-5 h-px bg-amber-500/60" />
        </div>
        {landingT("servingWithCare")}
      </div>

      <div className="relative z-10 w-full max-w-81.75 mx-auto bg-[rgba(12,8,3,0.1)] backdrop-blur-sm border border-amber-500/20 rounded-3xl px-6 py-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log("Validation errors:", errors),
            )}
            className="space-y-3"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <label className="block text-[10px] text-white/30 tracking-[0.25em] uppercase mb-2">
                    {t("guestLoginLabel")}
                  </label>
                  <input
                    {...field}
                    placeholder={t("guestLoginPlaceholder")}
                    autoFocus
                    className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-[#f2ece0] placeholder:text-white/20 outline-none focus:border-amber-500/50 focus:bg-white/9 transition-all"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              isLoading={isGuestLoginPending}
              className="text-white w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] transition-all duration-150 rounded-xl py-3.75 text-[15px] font-bold tracking-wide shadow-[0_4px_22px_rgba(201,160,48,0.32)]"
            >
              {t("enterStore")} →
            </Button>
          </form>
        </Form>

        <p className="text-center mt-4 text-sm text-white/15">
          © 2026 Fine Dining
        </p>
      </div>
    </div>
  );
}
