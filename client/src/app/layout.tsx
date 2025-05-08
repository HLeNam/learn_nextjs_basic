import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import AppProvider from "@/app/AppProvider";
import SlideSession from "@/components/slide-session";
import { baseOpenGraphMetadata } from "@/app/shared-metadata";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | Productic",
        default: "Productic",
    },
    description: "Được tạo bởi Yorick",
    openGraph: baseOpenGraphMetadata,
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // let user: AccountResType["data"] | null = null;

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} antialiased`}>
                <Toaster richColors />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Header user={null} />
                    <AppProvider user={null}>
                        {children} <SlideSession />
                    </AppProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
