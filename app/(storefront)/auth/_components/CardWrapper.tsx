"use client";

import Link from "next/link";
import React from "react";
import { Social } from "./Social";
import { BackButton } from "./BackButton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
 interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  buttonLabel: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  buttonLabel,
}: CardWrapperProps) => {
  return (
    
    <Card className=" shadow-lg bg-white ">
      <CardHeader className="font-normal">
        {/* <Header label={headerLabel} /> */}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <div className="flex w-full flex-col border-opacity-40">
        <CardFooter className="py-0">
          <BackButton
            buttonLabel={backButtonLabel}
            label={buttonLabel}
            href={backButtonHref}
          />
        </CardFooter>
        <div className="flex items-center py-2"><span className="border w-full"/><span className="px-4">OR</span><span className="border w-full"/></div>
        {showSocial && (
          <CardFooter>
            <Social />
          </CardFooter>
        )}
      </div>

      <CardFooter className="flex">
        <p className="text-xs">By registering or logging into your account, you accept the <Link href={'/'} className="font-semibold underline">Terms of Service</Link> and <Link href={'/'} className="font-semibold underline">Privacy Policy</Link></p>
        
      </CardFooter>
    </Card>
   
  );
};