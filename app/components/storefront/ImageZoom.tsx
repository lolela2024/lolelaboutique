import Image from 'next/image'
import React from 'react'

export default function ImageZoom({ src, alt }: {src:string, alt:string}) {
  return (
    <div className="overflow-hidden relative w-full h-auto">
      <Image 
        src={src} 
        alt={alt} 
        layout="responsive" 
        width={500} 
        height={500} 
        className="transition-transform duration-300 ease-in-out transform hover:scale-125" 
      />
    </div>
  )
}
