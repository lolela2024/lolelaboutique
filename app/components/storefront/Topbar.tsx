import React from 'react'
import Wrapper from './Wrapper';

export default function Topbar() {
  return (
    <div className='h-16 md:h-10 bg-primary'>
      <Wrapper className='py-0 h-full'>
        <div className='flex items-center justify-center h-full text-white'>
          <p className='text-xs lg:text-sm text-center'>CADOU SURPRIZĂ la fiecare comandă! Transport Gratuit la o comandă de minim 199 lei. (Doar pe teritoriul României)</p>
        </div>
      </Wrapper>
    </div>
  )
}
