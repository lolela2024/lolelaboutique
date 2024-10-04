import React from "react";
import { NewVerificationForm } from "../_components/NewVerificationForm";

const NewVerificationPage = () => {
  return (
    <div className="w-full">
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto">
        <NewVerificationForm />
      </div>
    </div>
  </div>
    
  )
};

export default NewVerificationPage;