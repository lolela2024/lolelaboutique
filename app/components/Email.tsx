"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";

export default function Email() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  return (
    <div>
      <Input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={handleEmailChange}
      />
      <button type="button">NEXT</button>
    </div>
  );
}
