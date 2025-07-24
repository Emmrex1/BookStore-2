
import { useContext, useEffect, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { FaMinus, FaPlus, FaArrowRight } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title/Title";
import CartTotal from "@/components/CartTotal/CartTotal";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Player } from "@lottiefiles/react-lottie-player";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const Cart = () => {
  const { books,navigate,currency,cartItems,setCartItems,user,backendUrl,token,getCartAmount,updateQuantity} = useContext(ShopContext);

  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteItem = async (itemId) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[itemId];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (user && token) {
      try {
        await fetch(`${backendUrl}/api/cart/delete-item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id, itemId }),
        });
      } catch (error) {
        console.error("Failed to delete item from backend cart", error);
      }
    }

    toast.success("Item removed from cart");
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const hasItems = books.some((item) => cartItems[item._id] > 0);

  const handleCheckout = () => {
    setCheckoutLoading(true);
    toast.success("Proceeding to checkout...");
    setTimeout(() => {
      navigate("/place-order");
    }, 1000);
  };

  const handleQuantityChange = (id, newQty) => {
    updateQuantity(id, newQty);
    if (newQty === 0) {
      toast.success("Item removed from cart");
    } else {
      toast.success("Cart updated");
    }
  };

  return (
    <section className="max-padd-container min-h-screen pt-28">
      <Title title1="Your" title2="Cart" title1Styles="h3" />

      {/* Cart Items */}
      <div className="mt-8 space-y-6">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm"
            >
              <div className="flex gap-4">
                <Skeleton width={96} height={96} />
                <div className="flex-grow space-y-2">
                  <Skeleton width={`70%`} height={20} />
                  <Skeleton width={`50%`} height={14} />
                  <Skeleton width={`30%`} height={14} />
                </div>
              </div>
            </div>
          ))
        ) : hasItems ? (
          books.map((item) =>
            cartItems[item._id] > 0 ? (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={item.images}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.category}
                    </p>

                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center bg-primary rounded-full px-3 py-1 dark:text-gray-700">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              cartItems[item._id] - 1
                            )
                          }
                          className="bg-white p-1 rounded-full hover:bg-gray-200 transition dark:text-gray-700"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="mx-3 text-white font-semibold dark:text-gray-700">
                          {cartItems[item._id]}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              cartItems[item._id] + 1
                            )
                          }
                          className="bg-white p-1 rounded-full hover:bg-gray-200 transition"
                          aria-label="Increase quantity"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      <div className="flex items-center gap-5">
                        <span className="font-bold text-gray-700 dark:text-white">
                          {currency}
                          {(item.price * cartItems[item._id]).toFixed(2)}
                        </span>

                        {/* AlertDialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setItemToDelete(item._id)}
                              className="text-blue-500 hover:text-red-600 transition"
                              aria-label="Remove item"
                            >
                              <TbTrash className="text-xl" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove item from cart?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone; are you sure you
                                want to delete this item from your cart?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteItem(itemToDelete)}
                              >
                                Yes, delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )
        ) : (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <Player
              autoplay
              loop
              src="https://assets4.lottiefiles.com/packages/lf20_sFgl3X.json"
              style={{ height: "250px", margin: "0 auto" }}
            />
            <p className="mt-4 mb-4 text-lg font-medium">
              Your cart is currently empty.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="btn-secondaryOne"
            >
              Browse Books
            </button>
          </div>
        )}
      </div>

      {/* Cart Total + Checkout */}
      {!loading && hasItems && (
        <div className="mt-16 max-w-lg mx-auto">
          <CartTotal />
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className={`w-full mt-6 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300
              ${
                checkoutLoading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:scale-105 hover:shadow-xl"
              }`}
          >
            {checkoutLoading ? (
              <>
                <ImSpinner2 className="animate-spin text-lg" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Checkout <FaArrowRight />
              </>
            )}
          </button>
        </div>
      )}
      <Footer />
    </section>
  );
};

export default Cart;
