import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Label } from '@radix-ui/react-label'
import React from 'react'

export default function PersoanaJuridica({fields}:{fields:any}) {
  return (
    <Card>
      <CardHeader className="p-0 bg-primary px-2 text-white py-1 overflow-hidden rounded-t-md font-semibold">
        Persoana Juridica:
      </CardHeader>
      <CardContent className="py-4">
        <div>
          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              Nume firma:
            </Label>
            <Input
              type="text"
              key={fields.numeFirma.key}
              name={fields.numeFirma.name}
              defaultValue={fields.numeFirma.initialValue}
              className={
                fields.numeFirma.errors
                  ? "w-full border-red-500 border-2 col-span-12 md:col-span-8"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder=" Nume firma *"
            />
            <p className="text-red-500 text-sm col-span-12">
              {fields.numeFirma.errors}
            </p>
          </div>
          <Separator className="mb-3" />

          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              CIF:
            </Label>
            <Input
              type="text"
              key={fields.cif.key}
              name={fields.cif.name}
              defaultValue={fields.cif.initialValue}
              className={
                fields.cif.errors
                  ? "w-full col-span-12 md:col-span-8 border-red-500 border-2"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="CIF *"
            />

            <p className="text-red-500 text-sm col-span-12">
              {fields.cif.errors}
            </p>
          </div>
          <Separator className="mb-3" />

          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              Nr. reg. comertului / An:
            </Label>
            <Input
              type="text"
              key={fields.nrRegComert.key}
              name={fields.nrRegComert.name}
              defaultValue={fields.nrRegComert.initialValue}
              className={
                fields.nrRegComert.errors
                  ? "w-full col-span-12 md:col-span-8 border-red-500 border-2"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="Nr. reg. comertului / An *"
            />

            <p className="text-red-500 text-sm col-span-12">
              {fields.nrRegComert.errors}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
