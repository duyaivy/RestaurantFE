import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Toaster } from "@/shared/ui/toaster";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import AppProvider from "@/shared/providers/app-provider";
import { SocketProvider } from "@/shared/providers/socket-provider";
import SocketRealtimeBridge from "@/features/orders/components/socket-realtime-bridge";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Cấu hình Metadata để tối ưu SEO tốt hơn và sử dụng tiếng Việt
export const metadata: Metadata = {
  title: "VietFood - Tinh Hoa Ẩm Thực Việt & Đồ Án môn học Sinh Viên",
  description:
    "VietFood là một nền tảng đặt món và quản lý nhà hàng trực tuyến được phát triển như một đồ án môn học của sinh viên ngành Công nghệ Thông tin. Hệ thống tập trung vào việc giới thiệu ẩm thực Việt Nam tinh túy, cung cấp trải nghiệm đặt món tiện lợi cho thực khách và giải pháp quản lý hiệu quả cho chủ nhà hàng. Khám phá thực đơn đa dạng và hỗ trợ sinh viên!",
  keywords: [
    "VietFood",
    "đặt món online",
    "quản lý nhà hàng",
    "ẩm thực Việt Nam",
    "đồ án môn học",
    "đồ án sinh viên",
    "ứng dụng Web",
    "Next.js",
    "dịch vụ ăn uống",
  ],
  authors: [{ name: "duyaivy" }],
  openGraph: {
    type: "website",
    url: "https://restaurant.duyaivy.id.vn",
    title: "VietFood - Nền Tảng Đặt Món & Quản Lý Nhà Hàng Việt Nam",
    description:
      "Khám phá ẩm thực Việt với VietFood, nền tảng đặt món và quản lý thông minh. Đây là một đồ án môn học của sinh viên. Đặt món ngay!",
    siteName: "VietFood",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "VietFood - Tinh Hoa Ẩm Thực Việt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VietFoodProj",
    title: "VietFood - Đồ Án Sinh Viên về Đặt Món & Quản Lý Nhà Hàng",
    description:
      "VietFood: Dự án môn học của sinh viên. Ẩm thực Việt Nam, đặt món tiện lợi, quản lý thông minh.",
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Thay đổi lang="en" thành lang="vi" để tối ưu hóa SEO địa phương
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <AppProvider>
          <SocketProvider>
            <SocketRealtimeBridge />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </SocketProvider>
        </AppProvider>
      </body>
    </html>
  );
}
