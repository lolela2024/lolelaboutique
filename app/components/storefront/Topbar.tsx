import React from 'react'
import Wrapper from './Wrapper';

export default function Topbar() {
  return (
    <div className='h-10 bg-primary'>
      <Wrapper className='py-0 h-full'>
        <div className='flex items-center justify-center h-full text-white'>
          <p className='text-sm'>CADOU SURPRIZA la fiecare comanda! Transport Gratuit la o comanda de minim 199lei!</p>
        </div>
      </Wrapper>
    </div>
  )
}
