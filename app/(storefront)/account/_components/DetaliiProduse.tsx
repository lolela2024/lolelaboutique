import { Product } from '@prisma/client'
import React from 'react'

interface iAppProps {
  data:any
}
export default function DetaliiProduse({data}:iAppProps) {

  let id = 0;

  console.log(data.products)
  return (
    <div>
      <h2 className='text-xl mb-2'>Detalii produse comandate:</h2>
      <table>
        <thead>
          <tr className='text-sm font-normal bg-gray-100'>
            <th className='w-[50px] font-normal bg-gray-100'>ID</th>
            <th className=' font-normal bg-gray-100'>Nume Produs</th>
            
            <th className='w-[80px] font-normal bg-gray-100'>Cantitate</th>
            <th className='w-[110px] font-normal bg-gray-100'>Pret/buc (Lei)</th>
            <th className='w-[100px] font-normal bg-gray-100'>Total (Lei)</th>
          </tr>
        </thead>
        <tbody>
          {data?.products?.map((product:any,index:number) => (
            <tr key={index}>
              <td>{++id}</td>
              <td>{product.Product.name}</td>
              <td className='text-center'>{product.quantity}</td>
              <td className='text-center'>{product.Product.price}</td>
              <td className='text-center'>{product.Product.price * product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
