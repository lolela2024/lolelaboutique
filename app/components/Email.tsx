"use client";

import { Input } from "@/components/ui/input";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
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
      <LoginLink
        authUrlParams={{
          connection_id:
            process.env.NEXT_PUBLIC_KINDE_CONNECTION_EMAIL_PASSWORDLESS || "",
          login_hint: email,
        }}
    
      ><button type="button">NEXT</button></LoginLink>
    </div>
  );
}
