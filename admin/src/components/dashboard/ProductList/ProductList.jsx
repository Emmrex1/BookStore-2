// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Trash2, Pencil, Package, Search, Filter } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import EditProductModal from "../EditPrductModal/EditProductModal";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel,
//      AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
//      AlertDialogHeader,
//       AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// const ProductListTable = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       const res = await axios.get("http://localhost:4000/api/product/list");
//       setProducts(res.data.products);
//     } catch (error) {
//       toast.error("Failed to fetch products.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/product/delete/${id}`);
//       toast.success("Product deleted successfully");
//       setProducts((prev) => prev.filter((item) => item._id !== id));
//     } catch (error) {
//       toast.error("Failed to delete product");
//     }
//   };

//   const handleEditClick = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.category.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-4">
//             <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//             <div className="h-12 bg-gray-200 rounded"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {[...Array(8)].map((_, i) => (
//                 <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <EditProductModal
//           open={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           product={selectedProduct}
//           onUpdate={fetchProducts}
//         />

//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <Package className="h-8 w-8 text-blue-600" />
//                 Product Management
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Manage your product inventory with ease
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Badge variant="secondary" className="text-sm">
//                 {filteredProducts.length} Products
//               </Badge>
//             </div>
//           </div>

//           {/* Search and Filter Section */}
//           <div className="mt-6 flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Products Grid */}
//         {filteredProducts.length === 0 ? (
//           <Card className="p-12 text-center">
//             <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               No products found
//             </h3>
//             <p className="text-gray-600">
//               {searchQuery
//                 ? "Try adjusting your search query"
//                 : "Start by adding your first product"}
//             </p>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredProducts.map((product) => (
//               <Card
//                 key={product._id}
//                 className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02]"
//               >
//                 <CardContent className="p-0">
//                   {/* Product Image */}
//                   <div className="relative overflow-hidden rounded-t-lg">
//                     <img
//                       src={product.images[0]}
//                       alt={product.name}
//                       className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
//                       loading="lazy"
//                     />
//                     {product.popular && (
//                       <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
//                         Popular
//                       </Badge>
//                     )}
//                     <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
//                       <Button
//                         size="sm"
//                         variant="secondary"
//                         onClick={() => handleEditClick(product)}
//                         className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
//                       >
//                         <Pencil className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <AlertDialog>
//                         <AlertDialogTrigger asChild>
//                           <Button
//                             size="sm"
//                             variant="secondary"
//                             className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
//                           >
//                             <Trash2 className="h-4 w-4 text-red-600" />
//                           </Button>
//                         </AlertDialogTrigger>
//                         <AlertDialogContent>
//                           <AlertDialogHeader>
//                             <AlertDialogTitle>Delete Product</AlertDialogTitle>
//                             <AlertDialogDescription>
//                               Are you sure you want to delete "{product.name}"?
//                               This action cannot be undone.
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction
//                               onClick={() => handleDelete(product._id)}
//                               className="bg-red-600 hover:bg-red-700"
//                             >
//                               Delete
//                             </AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                     </div>
//                   </div>

//                   {/* Product Details */}
//                   <div className="p-5">
//                     <div className="flex items-start justify-between mb-3">
//                       <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
//                         {product.name}
//                       </h3>
//                     </div>

//                     <div className="space-y-2 mb-4">
//                       <Badge variant="outline" className="text-xs capitalize">
//                         {product.category}
//                       </Badge>
//                       <p className="text-sm text-gray-600 line-clamp-2">
//                         {product.description}
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                       <div className="text-2xl font-bold text-green-600">
//                         ${product.price}
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEditClick(product)}
//                           className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
//                         >
//                           <Pencil className="h-3 w-3 mr-1" />
//                           Edit
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductListTable;
import React, { useContext, useEffect, useState } from "react";
import { Trash2, Pencil, Package, Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditProductModal from "../EditPrductModal/EditProductModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AdminContextApi } from "@/context/api/AdmincontexApi";


const ProductListTable = () => {
  const { backendUrl, token } = useContext(AdminContextApi);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch admin products using axios
  const fetchAdminProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res)
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Server error while fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Delete product with axios
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/product/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Product deleted successfully");
        fetchAdminProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting product");
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <EditProductModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          onUpdate={fetchAdminProducts}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                Product Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your product inventory with ease
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredProducts.length} Products
            </Badge>
          </div>

          {/* Search */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start by adding your first product"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02]"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    {product.popular && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                        Popular
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditClick(product)}
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs capitalize my-2"
                    >
                      {product.category}
                    </Badge>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between border-t pt-3">
                      <div className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(product)}
                        className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListTable;
