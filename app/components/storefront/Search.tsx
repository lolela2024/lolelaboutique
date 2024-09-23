import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search as SearchIcon } from 'lucide-react'
import React from 'react'

export default function Search() {
  return (
    <div className='relative'>
      <Input className='rounded-3xl pl-6' type="text" placeholder='Search...'/>
      <button className='absolute top-0 right-0 bg-buttonColor text-white p-[10px] rounded-full'><SearchIcon className='stroke-1 w-5 h-5'/></button>
    </div>
  )
}
