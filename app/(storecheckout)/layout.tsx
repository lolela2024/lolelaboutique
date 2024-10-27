import React, { ReactNode } from "react";
import Navbar from "../components/storefrontcheckout/Navbar";

export const metadata = {
  metadataBase: new URL("https://lolelaboutique.ro"),
  // alte setări de metadate
}

export default function StoreCheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
