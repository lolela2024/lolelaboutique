"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa";
import { login } from "../../../actions/auth";

const LoginGoogle = () => {
  return (
    <div
      onClick={() => login("google")}
      className="w-full gap-4  hover:cursor-pointer mt-6 h-12 rounded-md p-4 flex justify-center items-center"
    >
      <FaGoogle className="" />
      <p className="">Login with Google</p>
    </div>
  );
};

export default LoginGoogle;