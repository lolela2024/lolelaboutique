import { Input } from '@/components/ui/input'
import { Search as SearchIcon } from 'lucide-react'
import React from 'react'

export default function Search() {
  return (
    <div className='relative'>
      <Input className='rounded-3xl pl-6' type="text" placeholder='Search...'/>
      <SearchIcon className='absolute stroke-1 w-5 h-5 bottom-[10px] right-[16px] text-gray-600'/>
    </div>
  )
}
