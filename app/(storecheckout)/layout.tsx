import React, { ReactNode } from "react";
import Navbar from "../components/storefrontcheckout/Navbar";

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
