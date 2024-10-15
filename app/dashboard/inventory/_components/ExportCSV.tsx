"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";

const exportCSV = async () => {
  try {
    const response = await axios.get("/api/export-inventory", {
      responseType: "blob", // asigură-te că răspunsul este în format blob
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv"; // Numele fișierului exportat
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Failed to export CSV", error);
  }
};

export default function ExportCSV() {
  return (
    <Button onClick={exportCSV} className="mt-4">
      Export CSV
    </Button>
  );
}
