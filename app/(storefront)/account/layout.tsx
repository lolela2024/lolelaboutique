import React from "react";
import SidebarAccount from "./_components/SidebarAccount";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }
  
  return (
    <>
      <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-250px)] py-8">
        <SidebarAccount />
        <div className="col-span-12 md:col-span-9">{children}</div>
      </div>
    </>
  );
}
