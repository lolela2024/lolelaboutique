import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function AccountPage() {
  const {getUser} = getKindeServerSession();
  const user = await getUser();
 
  if(!user){
    redirect("/")
  }
  return (
    <div className=''>AccountPage</div>
  )
}
