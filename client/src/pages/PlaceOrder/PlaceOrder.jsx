import React, { useState, useContext } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShopContext } from "../../context/ShopContext";
import CartTotal from "@/components/CartTotal/CartTotal";
import axios from "axios";

const PlaceOrder = () => {
  const {
    books,
    navigate,
    token,
    user,
    cartItems,
    backendUrl,
    setCartItems,
    getCartAmount,
    delivery_charges,
    currency,
  } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const shipping = subtotal === 0 ? 0 : delivery_charges;
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [method, setMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    const orderItems = Object.entries(cartItems)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = books.find((book) => book._id === id);
        if (product) {
          return {
            ...product,
            quantity: qty,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (orderItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderData = {
      userId: user._id,
      items: orderItems,
      address: formData,
      amount: total,
    };

    try {
      setIsSubmitting(true);

      switch (method) {
        case "cod":
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            {
              withCredentials: true, 
            },
            { headers: { token } }
            
          );
           console.log(response.data)
          if (response.data.success) {
            setCartItems({});
            toast.success("Order placed successfully!");
            navigate("/order");
          } else {
            toast.error(response.data.message || "Failed to place order.");
          }
          break;

        case "stripe":
          toast.warning("Stripe payment not yet implemented.");
          break;

        default:
          toast.error("Invalid payment method selected.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl min-h-screen mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold py-6 text-gray-900 dark:text-white">
          Place Your Order
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Fill in your shipping information and review your order total.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-10 items-start"
      >
        {/* Shipping Form */}
        <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Order Summary + Payment Method */}
        <div className="space-y-6">
          <CartTotal />

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Payment Method
            </h3>
            <div className="flex gap-4">
              <div
                onClick={() => setMethod("stripe")}
                className={`cursor-pointer border rounded-lg px-4 py-2 transition ${
                  method === "stripe"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-300"
                }`}
              >
                Stripe
              </div>
              <div
                onClick={() => setMethod("cod")}
                className={`cursor-pointer border rounded-lg px-4 py-2 transition ${
                  method === "cod"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-300"
                }`}
              >
                Cash on Delivery
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
