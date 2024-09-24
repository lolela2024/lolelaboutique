import Link from 'next/link'
import React from 'react'

export default function SidebarWishlist() {
  return (
    <ul>
      <li><Link href={'#'}>Status comanda</Link></li>
      <li><Link href={'/wishlist'}>Produse Salvate</Link></li>
      <li><Link href={'#'}>Inregistrare</Link></li>
    </ul>
  )
}
