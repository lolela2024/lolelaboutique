import { CheckoutFormProps } from "@/app/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

const județeRomânia = [
  { romanian: "Arad", english: "Arad" },
  { romanian: "Argeș", english: "Argeș" },
  { romanian: "Alba", english: "Alba" },
  { romanian: "Bacău", english: "Bacău" },
  { romanian: "Bihor", english: "Bihor" },
  { romanian: "Bistrița-Năsăud", english: "Bistrița-Năsăud" },
  { romanian: "Botoșani", english: "Botoșani" },
  { romanian: "Brașov", english: "Brașov" },
  { romanian: "Brăila", english: "Brăila" },
  { romanian: "Buzău", english: "Buzău" },
  { romanian: "Caraș-Severin", english: "Caraș-Severin" },
  { romanian: "Călărași", english: "Călărași" },
  { romanian: "Cluj", english: "Cluj" },
  { romanian: "Constanța", english: "Constanța" },
  { romanian: "Covasna", english: "Covasna" },
  { romanian: "Dâmbovița", english: "Dâmbovița" },
  { romanian: "Dolj", english: "Dolj" },
  { romanian: "Galați", english: "Galați" },
  { romanian: "Giurgiu", english: "Giurgiu" },
  { romanian: "Gorj", english: "Gorj" },
  { romanian: "Harghita", english: "Harghita" },
  { romanian: "Hunedoara", english: "Hunedoara" },
  { romanian: "Ialomița", english: "Ialomița" },
  { romanian: "Iași", english: "Iași" },
  { romanian: "Ilfov", english: "Ilfov" },
  { romanian: "Maramureș", english: "Maramureș" },
  { romanian: "Mehedinți", english: "Mehedinți" },
  { romanian: "Mureș", english: "Mureș" },
  { romanian: "Neamț", english: "Neamț" },
  { romanian: "Olt", english: "Olt" },
  { romanian: "Prahova", english: "Prahova" },
  { romanian: "Satu Mare", english: "Satu Mare" },
  { romanian: "Sălaj", english: "Sălaj" },
  { romanian: "Sibiu", english: "Sibiu" },
  { romanian: "Suceava", english: "Suceava" },
  { romanian: "Teleorman", english: "Teleorman" },
  { romanian: "Timiș", english: "Timiș" },
  { romanian: "Tulcea", english: "Tulcea" },
  { romanian: "Vaslui", english: "Vaslui" },
  { romanian: "Vâlcea", english: "Vâlcea" },
  { romanian: "Vrancea", english: "Vrancea" },
];

export default function ShippingForm({fields, user}:{fields:any, user:CheckoutFormProps["user"]}) {
  const countyOptions = județeRomânia.map((judet, index) => (
    <SelectItem key={index} value={judet.romanian}>
      {judet.romanian}
    </SelectItem>
  ));

  return (
    <div className="p-4 border rounded-md bg-[#f5f5f5] space-y-2">
      <div className="flex flex-col gap-3 mt-4">
        <Label>Country</Label>
        <Select
          key={fields.country.key}
          name={fields.country.name}
          defaultValue={user?.address[0] ? user?.address[0].country : "romania"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="romania">Romania</SelectItem>
            <SelectItem value="germany">Germany</SelectItem>
            <SelectItem value="hungary">Hungary</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-red-500 text-sm">{fields.country.errors}</p>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-3 w-full">
          <Input
            type="text"
            key={fields.name.key}
            name={fields.name.name}
            defaultValue={user?.name || ''}
            className={
              fields.firstName.errors
                ? "w-full border-red-500 border-2"
                : "w-full"
            }
            placeholder="First name"
          />
          <p className="text-red-500 text-sm">{fields.firstName.errors}</p>
        </div>
        {/* <div className="flex flex-col gap-3 w-full">
          <Input
            type="text"
            key={fields.lastName.key}
            name={fields.lastName.name}
            defaultValue={user?.name || ''}
            className={
              fields.lastName.errors
                ? "w-full border-red-500 border-2"
                : "w-full"
            }
            placeholder="Last name"
          />
          <p className="text-red-500 text-sm">{fields.lastName.errors}</p>
        </div> */}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Input
          type="text"
          key={fields.company.key}
          name={fields.company.name}
          defaultValue={fields.company.initialValue}
          
          className={
            fields.company.errors ? "w-full border-red-500 border-2" : "w-full"
          }
          placeholder="Company (optional)"
        />
        <p className="text-red-500 text-sm">{fields.company.errors}</p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Input
          type="text"
          key={fields.address.key}
          name={fields.address.name}
          defaultValue={user?.address[0]?.address}
          className={
            fields.address.errors ? "w-full border-red-500 border-2" : "w-full"
          }
          placeholder="Address"
        />
        <p className="text-red-500 text-sm">{fields.address.errors}</p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Input
          type="text"
          key={fields.address2.key}
          name={fields.address2.name}
          defaultValue={user?.address[0]?.address2 || undefined}
          className={
            fields.address2.errors ? "w-full border-red-500 border-2" : "w-full"
          }
          placeholder="Apartment, suite, etc. (optional)"
        />
        <p className="text-red-500 text-sm">{fields.address2.errors}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-3 w-full">
          <Input
            type="text"
            key={fields.postalCode.key}
            name={fields.postalCode.name}
            defaultValue={user?.address[0]?.postalCode || undefined}
            className={
              fields.postalCode.errors
                ? "w-full border-red-500 border-2"
                : "w-full"
            }
            placeholder="Postal code (optional)"
          />
          <p className="text-red-500 text-sm">{fields.postalCode.errors}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Input
            type="text"
            key={fields.city.key}
            name={fields.city.name}
            defaultValue={user?.address[0]?.city}
            className={
              fields.city.errors ? "w-full border-red-500 border-2" : "w-full"
            }
            placeholder="City"
          />
          <p className="text-red-500 text-xs">{fields.city.errors}</p>
        </div>
        <div className="flex flex-col gap-3 ">
          <Select key={fields.county.key} name={fields.county.name} defaultValue={user?.address[0]?.county}>
            <SelectTrigger>
              <SelectValue placeholder="County" />
            </SelectTrigger>
            <SelectContent>{countyOptions}</SelectContent>
          </Select>
          <p className="text-red-500 text-xs">{fields.county.errors}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Input
          type="text"
          key={fields.phone.key}
          name={fields.phone.name}
          defaultValue={user?.phone || ''}
          className={
            fields.phone.errors ? "w-full border-red-500 border-2" : "w-full"
          }
          placeholder=" 0040 111 1111111"
        />
        <p className="text-red-500 text-xs">{fields.phone.errors}</p>
      </div>
    </div>
  );
}
