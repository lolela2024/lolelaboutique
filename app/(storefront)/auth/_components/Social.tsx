"use client"

import { FcGoogle } from "react-icons/fc"

import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"


export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl:"/"
    })
  }
  return (
    <div className="flex flex-col items-center w-full gap-y-2">
      <Button 
        type="button"
        size={'lg'}
        className="w-full"
        variant={'outline'}
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5 mr-2"/>
        Google
      </Button>
      <Button 
        type="button"
        size={'lg'}
        className="w-full"
        variant={'outline'}
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5 mr-2"/>
        Github
      </Button>
    </div>
  )
}