"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { informatiiUpdate } from "../_actions/informatii";
import { informatiiSchema } from "@/app/lib/zodSchemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Submitbutton } from "@/app/components/SubmitButtons";
import bcrypt from 'bcryptjs';

interface InformatiiFormProps {
  user: {
    id: string;
    email: string;
    password: string | null;
    name: string | null;
    username: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    role: UserRole;
    isTwoFactorEnabled: boolean;
  } | null;
}

export default function InformatiiForm({ user }: InformatiiFormProps) {
  const [lastResult, action] = useFormState(informatiiUpdate, undefined);
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: informatiiSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });  

  useEffect(()=>{
    const passwordB = bcrypt.compareSync(password || "", user?.password || "")

    if(!passwordB || password !== user?.password){
      setError("The current password is incorrect. Please try again.")
    }else{
      setError("")
    }
  },[password])
  
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="">
        <div className="flex items-center gap-6 mb-6">
          <Label>Mod de adresare</Label>
          <RadioGroup
            key={fields.gender.key}
            name={fields.gender.name}
            defaultValue={user?.gender || ""}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="masculin" id="r1" />
              <Label htmlFor="r1">Dl.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="feminin" id="r2" />
              <Label htmlFor="r2">Dna.</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col mb-4">
          <Label className="mb-2">Nume de familie</Label>
          <Input
            type="text"
            key={fields.name.key}
            name={fields.name.name}
            defaultValue={user?.name || ""}
            className="w-full"
          />
          <p className="text-red-500 mt-1">{fields.name.errors}</p>
        </div>

        <div className="flex flex-col mb-4">
          <Label className="mb-2">E-mail</Label>
          <Input
            type="email"
            key={fields.email.key}
            name={fields.email.name}
            defaultValue={user?.email}
            className="w-full"
          />
          <p className="text-red-500 mt-1">{fields.email.errors}</p>
        </div>

        <div className="flex flex-col mb-4">
          <Label className="mb-2">Parola</Label>
          <Input
            type="password"
            key={fields.password.key}
            name={fields.password.name}
            defaultValue={user?.password || ""}
            onChange={(ev)=>setPassword(ev.target.value)}
            className="w-full"
          />
          <p className="text-red-500 mt-1">{fields.password.errors || error}</p>
        </div>

        <div className="flex flex-col mb-4">
          <Label className="mb-2">Parola noua</Label>
          <Input
            type="password"
            key={fields.newPassword.key}
            name={fields.newPassword.name}
            className="w-full"
          />
          <p className="text-red-500 mt-1">{fields.newPassword.errors}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Submitbutton title="Salveaza" error={error} />
      </div>
    </form>
  );
}
