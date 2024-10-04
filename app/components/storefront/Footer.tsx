"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Wrapper from "./Wrapper";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import Newsletter from "./Newsletter";
import CustomImage from "@/components/CustomImage";

export function Footer() {
  const [button, setButton] = useState("");

  return (
    <footer className="bg-[#f7f7f7] bg-cover bg-center  mt-8 text-gray-700">
      <Wrapper>
        <div className="grid md:grid-cols-3 gap-4 py-4">
          <div className="col-span-1">
            <div className="footer-about-us">
              <aside>
                <p>
                  <strong>COJOCARU T. V. IONELA PFA</strong>
                </p>
                <p>
                  <strong>C.U.I:</strong> 49597646
                </p>
                <p>
                  <strong>Adresa:</strong> Paunesti, Vrancea
                </p>
                <p>
                  <strong>Email:</strong>
                  <span className="text-sm font-semibold">
                    {" "}
                    contact@lolelaboutique.ro
                  </span>
                </p>
                <br />
                <h4>URMARITI-NE</h4>
                <ul className="flex items-center gap-2">
                  <Link href={"/"} className="text-[#06a9f4]">
                    <FaFacebook size={36} />
                  </Link>
                  <Link href={"/"}>
                    <FaInstagramSquare size={36} />
                  </Link>
                </ul>
              </aside>
            </div>
          </div>
          <div className="col-span-2">
            <div className="block-newsletter mt-2 mb-8">
              <Newsletter />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 text-sm">
              <section>
                <aside>
                  <h3 className="font-semibold">INFORMATII CLIENTI</h3>
                  <ul className="">
                    <li className="py-1"><Link href={"#"}>Cum cumpar?</Link></li>
                    <li className="py-1"><Link href={"#"}>Transport si Livrare</Link></li> 
                    <li className="py-1"><Link href={"#"}>Plăți securizate</Link></li>
                    <li className="py-1"><Link href={"#"}>Retur produse</Link></li>
                  </ul>
                </aside>
              </section>
              <section>
                <aside>
                  <h3 className="font-semibold">DESPRE NOI</h3>
                  <ul className="">
                    <li className="py-1"><Link href={"#"}>Despre noi</Link></li>
                    <li className="py-1"><Link href={"#"}>Contact</Link></li> 
                    <li className="py-1"><Link href={"#"}>Termeni si conditii</Link></li>
                    <li className="py-1"><Link href={"#"}>ANPC</Link></li>
                  </ul>
                </aside>
              </section>
              <section>
                <aside>
                  <h3 className="font-semibold">GDPR</h3>
                  <ul className="">
                    <li className="py-1"><Link href={"#"}>GDPR</Link></li>
                    <li className="py-1"><Link href={"#"}>Politica fisierelor cookies</Link></li> 
                    <li className="py-1"><Link href={"#"}><CustomImage src="/anpc-sal.png" alt="anpc-sal"/></Link></li> 
                    <li className="py-1"><Link href={"#"}><CustomImage src="/anpc-sol.png" alt="anpc-sol"/></Link></li>  
                  </ul>
                </aside>
              </section>
            </div>
          </div>
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
