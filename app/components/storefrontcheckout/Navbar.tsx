import Link from 'next/link'
import React from 'react'
import Logo from '../storefront/Logo'

export default function Navbar() {
  return (
    <div className='bg-white h-20 border-b flex items-center justify-center p-8'>
      <Logo />
    </div>
  )
}
