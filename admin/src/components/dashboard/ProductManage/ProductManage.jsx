import React from "react";
import ProductForm from "../ProductForm/ProductForm";


const ProductManagement = () => {
  return (
    <div className=" bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProductForm />
        </div>
      </main>
    </div>
  );
};

export default ProductManagement;
