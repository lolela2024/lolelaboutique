import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

export default function HeroText() {
  return (
    <Card className='my-10 shadow-md border-none bg-[#f7f7f7]'>
      <CardContent className='p-4 text-center font-extralight text-base'>
        <p><strong className='font-semibold'>Lolela Boutique</strong> vă oferă o gamă largă de bijuterii create manual cu bucurie… pentru bucurie.</p>
        <p className='italic'>„Bijuteriile sunt ca și condimentul perfect – complimentează ceea ce este deja acolo.”</p>
        <p>Diane von Furstenberg</p>
      </CardContent>
    </Card>
  )
}
