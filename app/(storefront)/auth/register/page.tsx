import React from "react";
import { RegisterForm } from "../_components/RegisterForm";
import Image from "next/image";

const RegisterPage = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[500px] lg:grid-cols-2 xl:min-h-[600px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 ">
          <RegisterForm />
        </div>
      </div>

      <div className="hidden bg-muted lg:block">
        <Image
          src="/test.webp"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
