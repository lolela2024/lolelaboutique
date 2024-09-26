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
              key={fields.lastName.key}
              name={fields.lastName.name}
              defaultValue={fields.lastName.initialValue}
              className={
                fields.lastName.errors
                  ? "w-full col-span-12 md:col-span-8 border-red-500 border-2"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="CIF *"
            />

            <p className="text-red-500 text-sm col-span-12">
              {fields.lastName.errors}
            </p>
          </div>
          <Separator className="mb-3" />

          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              Nr. reg. comertului / An:
            </Label>
            <Input
              type="text"
              key={fields.phone.key}
              name={fields.phone.name}
              defaultValue={fields.phone.initialValue}
              className={
                fields.phone.errors
                  ? "w-full col-span-12 md:col-span-8 border-red-500 border-2"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="Nr. reg. comertului / An *"
            />

            <p className="text-red-500 text-sm col-span-12">
              {fields.phone.errors}
            </p>
          </div>
          <Separator className="mb-3" />

          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              Sediul firmei:
            </Label>
            <Input
              type="text"
              key={fields.email.key}
              name={fields.email.name}
              defaultValue={fields.email.initialValue}
              className={
                fields.email.errors
                  ? "w-full col-span-12 md:col-span-8 border-red-500 border-2"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="Sediul firmei *"
            />

            <p className="text-red-500 text-sm col-span-12">
              {fields.email.errors}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
