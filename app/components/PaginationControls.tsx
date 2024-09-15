"use client";

import { Button } from "@/components/ui/button";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface PaginationControlsProps {
  entries: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  entries,
  hasNextPage,
  hasPrevPage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = usePathname()

  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "5";

  // Stare pentru loading
  const [loading, setLoading] = useState(false);

  const handlePageChange = (newPage: number) => {
    setLoading(true); // Setează loading la true înainte de navigare

    // Navighează către pagina următoare
    router.push(`${params}?page=${newPage}&per_page=${per_page}`);

    // Simulăm finalizarea încărcării (în cazul tău poate fi gestionată printr-un alt mod)
    setTimeout(() => {
      setLoading(false); // Oprește loading după un timp
    }, 500); // Poți ajusta acest timp în funcție de cât durează navigarea
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant={"secondary"}
        size={"sm"}
        disabled={!hasPrevPage || loading}
        onClick={() => handlePageChange(Number(page) - 1)}
      >
        Prev
      </Button>
      
      <Button
        variant={"secondary"}
        size={"sm"}
        disabled={!hasNextPage || loading}
        onClick={() => handlePageChange(Number(page) + 1)}
      >
        Next
      </Button>
      <div className="border px-2 py-1 rounded-lg text-gray-600 font-thin">
        {page} / {Math.ceil(entries / Number(per_page))}
      </div>
    </div>
  );
};

export default PaginationControls;
