import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import {
  Loader2,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  BookOpen,
  Calendar,
  Package,
  Shield,
  Truck,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const { backendUrl, addToCart } = useContext(ShopContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);
        if (res.data.success) {
          setBook(res.data.book);
        } else {
          toast.error("Book not found");
        }
      } catch (error) {
        toast.error("Error fetching book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, backendUrl]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(book._id);
    }
    toast.success(`${quantity} book${quantity > 1 ? "s" : ""} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
          Book not found
        </h2>
        <p className="text-muted-foreground">
          The book you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="mb-8 text-sm text-muted-foreground">
          <span>Home</span> / <span>Books</span> / {book.name}
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={book.images}
                    alt={book.name}
                    className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="sm" variant="secondary">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              {book.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              by <span className="font-semibold">{book.author}</span>
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700"
              >
                {book.category}
              </Badge>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  (4.8 • 245 reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                ${book.price}
              </span>
              <span className="text-xl text-muted-foreground line-through">
                ${(book.price * 1.2).toFixed(2)}
              </span>
              <Badge variant="destructive">20% OFF</Badge>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button variant="outline" className="h-12 px-6">
                Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" /> Free shipping over $50
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" /> Secure payment
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" /> Fast delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" /> 30-day returns
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent>
            <div className="flex gap-8 border-b px-6">
              {["description", "details", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 font-medium capitalize border-b-2 transition-colors ${
                    selectedTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6">
              {selectedTab === "description" && (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {book.description}
                </p>
              )}
              {selectedTab === "details" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Author:</span>
                      <span>{book.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{book.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ISBN:</span>
                      <span>{book.isbn || "N/A"}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span>English</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pages:</span>
                      <span>320</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Publisher:</span>
                      <span>Penguin Books</span>
                    </div>
                  </div>
                </div>
              )}
              {selectedTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <Card
                        key={review}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <p className="font-medium">Amazing read!</p>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              2 days ago
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            This book exceeded my expectations. The writing is
                            engaging and the plot is well-developed.
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            - John D.
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
