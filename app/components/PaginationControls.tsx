"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useState } from "react";

interface PaginationControlsProps {
  entries: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;  // Adăugat
  perPage: number;      // Adăugat
}

const PaginationControls: FC<PaginationControlsProps> = ({
  entries,
  hasNextPage,
  hasPrevPage,
  currentPage,
  perPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Stare pentru loading
  const [loading, setLoading] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(entries / perPage)) {
      return; // Previne navigarea în afara limitelor
    }

    setLoading(true); // Setează loading la true înainte de navigare

    // Navighează către pagina următoare
    router.push(`${pathname}?page=${newPage}&per_page=${perPage}`);

    // Oprește loading după un timp
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant={"secondary"}
        size={"sm"}
        disabled={!hasPrevPage || loading}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Prev
      </Button>
      
      <Button
        variant={"secondary"}
        size={"sm"}
        disabled={!hasNextPage || loading}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
      
      <div className="border px-2 py-1 rounded-lg text-gray-600 font-thin">
        {currentPage} / {Math.ceil(entries / perPage)} {/* Afișează pagina curentă și totalul paginilor */}
      </div>
    </div>
  );
};

export default PaginationControls;
