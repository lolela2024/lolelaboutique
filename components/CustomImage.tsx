import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

type Props = {
  className?:string;
  src:string;
  alt:string;
  priority?: boolean;
  width?:number;
  height?:number;
  sizes?:string;
  style?:any;
}

export default function CustomImage({src,alt,priority, width, height, className, sizes, style}:Props) {
  return (
    <Image 
      className={cn(className,'mx-auto')}
      src={src}
      width={width || 640}
      height={height || 640}
      sizes={sizes}
      alt={alt}
      priority={!!priority}
      style={style}
    />
  )
}
