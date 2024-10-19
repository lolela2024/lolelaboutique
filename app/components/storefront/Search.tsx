"use client";

import { Input } from "@/components/ui/input";
import { Loader2, Search as SearchIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import CustomImage from "@/components/CustomImage";
import { formatCurrency } from "../../lib/formatters";

function filterProducts(products: Product[], searchTerm: string): Product[] {
  // Normalizează termenul de căutare
  const normalizedSearchTerm = searchTerm
    .trim()
    .toLowerCase()
    .split(" ") // Împarte termenul în cuvinte
    .filter(Boolean); // Elimină cuvintele goale

  // Filtrează produsele pe baza termenului de căutare
  return products.filter((product) => {
    const normalizedProductName = product.name.toLowerCase(); // Normalizează numele produsului
    return normalizedSearchTerm.every(
      (term) => normalizedProductName.includes(term) // Verifică dacă fiecare termen din căutare este inclus în numele produsului
    );
  });
}

function highlightSearchTerm(productName: string, searchTerm: string): string {
  if (!searchTerm) return productName; // Returnează numele produsului original dacă termenul de căutare este gol.

  // Creăm un regex pentru a căuta termenul de căutare
  const regex = new RegExp(`(${searchTerm})`, "gi"); // 'g' pentru a căuta în tot textul, 'i' pentru a ignora case
  const highlightedName = productName.replace(regex, "<strong>$1</strong>"); // Înlocuim termenul cu varianta sa bold

  return highlightedName; // Returnăm numele produsului cu termenele căutate bold
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
};

export default function Search() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  const divRef = useRef<HTMLDivElement | null>(null);

  const getSearchParams = useSearchParams();
  const searchParams = getSearchParams.get("search");

  // Ref pentru a gestiona temporizatorul de debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = async (searchTerm: string) => {
    // Dacă searchTerm nu este definit sau este gol, setează loading la false și returnează
    if (!searchTerm) {
      setLoading(false); // Se asigură că loading este false
      setProducts([]); // Resetează produsele
      return;
    }

    // Verifică dacă lungimea searchTerm este mai mică de 2
    if (searchTerm.length < 2) {
      setProducts([]); // Resetează produsele
      setLoading(true); // Setează loading la true
      return;
    }

    try {
      setLoading(true)

      const encodeSearchQuery = encodeURI(searchTerm);

      const { data } = await axios.post<Product[]>("/api/search", {
        filter: {
          name: encodeSearchQuery,
        },
      });

      const filteredProducts = filterProducts(data, searchTerm);

      // presupunând că răspunsul este direct un array de produse
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Something went wrong!", error);
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce de 300ms
    debounceTimeoutRef.current = setTimeout(() => {
      fetchProducts(search);
    }, 300);

    return () => {
      clearTimeout(debounceTimeoutRef.current!);
    };
  }, [search]);

  // Funcția care se ocupă de click-ul în afara div-ului
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      // Dacă face click în afara div-ului, închide
      if (divRef.current && !divRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Atașează event listener-ul când componenta se montează
    document.addEventListener('mousedown', handleClickOutside);

    // Dezatașează event listener-ul când componenta se demontează
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [divRef]);

 

  return (
    <div className="relative">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-3xl pl-6"
        type="text"
        placeholder="Caută produse..."
      />
      {loading && (
        <div className="absolute top-[10px] right-[30px]">
          <Loader2 className=" mr-4 h-5 w-5 animate-spin" />
        </div>
      )}
      <button className="absolute top-0 right-0 bg-buttonColor text-white p-[10px] rounded-full">
        <SearchIcon className="stroke-1 w-5 h-5" />
      </button>

      {/* Afișăm rezultatele dacă sunt produse găsite */}
      {/* {load && <p>Se încarcă...</p>} */}

      {open && products.length > 0 &&  (
        <Card ref={divRef} className="absolute z-10 bg-white shadow-lg rounded-lg w-full mt-2 max-h-[300px] overflow-scroll">
          <CardHeader className="px-4 py-4">
            <h3 className="font-semibold">Produse:</h3>
          </CardHeader>
          <Separator className="mb-2" />
          <CardContent className="p-0">
            <div className="px-4 ">
              {products.map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id}>
                  <div className="flex items-start gap-4">
                    <div>
                      {product.images ? (
                        <CustomImage
                          src={product.images[0]}
                          alt={product.name}
                          width={80}
                          height={80}
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(product.name, search),
                        }}
                      />
                      <span className="text-primary font-semibold">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-2" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
