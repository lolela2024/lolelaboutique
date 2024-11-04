import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lolelaboutique.ro"),
  title: {
    default:
      "Lolela Boutique - Bijuterii Handmade din Pietre Semiprețioase și Oțel Inoxidabil",
    template:
      "%s - Lolela Boutique - Bijuterii Handmade din Pietre Semiprețioase și Oțel Inoxidabil",
  },
  description:
    "Descoperă bijuterii unice, handmade, din oțel inoxidabil și pietre semiprețioase, personalizate în funcție de numerologie și astrologie. Lolela Boutique - eleganță și originalitate la fiecare pas.",
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="ro">
        <body className={lora.className}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Providers>{children}</Providers>
          <Toaster richColors theme="light" closeButton />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </SessionProvider>
  );
}
