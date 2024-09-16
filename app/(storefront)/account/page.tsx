import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function AccountPage() {
  const session = await auth()
  const user = session?.user;
 
  if(!user){
    redirect("/")
  }
  return (
    <div className=''>AccountPage</div>
  )
}
