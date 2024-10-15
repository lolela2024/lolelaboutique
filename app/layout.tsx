import type { Metadata } from "next";
import {
  Montserrat,
  Montserrat_Subrayada,
  Roboto_Serif,
} from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const montseratSerif = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lolela Boutique - Bijuterii Handmade din Piatra Semiprețioasă și Oțel Inoxidabil",
  description: "Descoperă bijuterii unice, handmade, din oțel inoxidabil și pietre semiprețioase, personalizate în funcție de numerologie și astrologie. Lolela Boutique - eleganță și originalitate la fiecare pas.",
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
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </head>
        <body className={montseratSerif.className}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Providers>{children}</Providers>
          <Toaster richColors theme="light" closeButton />
        </body>
      </html>
    </SessionProvider>
  );
}
