import Link from 'next/link'
import React from 'react'
import Logo from '../storefront/Logo'

export default function Navbar() {
  return (
    <div className='bg-white h-24 border-b flex items-center justify-center p-8'>
      <Logo />
    </div>
  )
}
