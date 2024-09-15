import React from "react";
import SidebarAccount from "./_components/SidebarAccount";
import FooterAccount from "./_components/FooterAccount";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-250px)]">
        <SidebarAccount />
        <div className="col-span-12 md:col-span-9">
          {children}
          </div>
      </div>
    </>
  );
}
