"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Wrapper from "./Wrapper";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [button, setButton] = useState("");

  return (
    <footer className="bg-[#ffeefa] bg-cover bg-center  mt-8 ">
      
      <Wrapper>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white bg-opacity-40">
            <CardContent className="py-4">kjnkjnkj</CardContent>
            <CardFooter>
              <Button onClick={() => setButton("Tata este in Germania")}>
                Save
              </Button>
              <p>{button}</p>
            </CardFooter>
          </Card>
          <Card className="bg-white bg-opacity-40">
            <CardContent className="py-4">dfdfsdfsf</CardContent>
          </Card>
          <Card className="bg-white bg-opacity-40">
            <CardContent className="py-4">dfdfsdfsf</CardContent>
          </Card>
        </div>
      </Wrapper>

      <div className=" bg-[#3a3a3a] text-gray-200">
        <Wrapper className="py-4">
          <p className="text-xs leading-5">
            &copy; 2024 Trix<span className="text-red-500">Tu</span>. All Rights
            Reserved.
          </p>
        </Wrapper>
      </div>
    </footer>
  );
}
