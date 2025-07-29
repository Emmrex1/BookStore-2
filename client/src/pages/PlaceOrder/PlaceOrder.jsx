
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ShopContext } from "@/context/ShopContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, PackageCheck } from "lucide-react";

const PlaceOrder = () => {
  const {
    backendUrl,
    user,
    books,
    cartItems,
    delivery_charges,
    currency,
    getCartAmount,
    setCartItems,
    navigate,
  } = useContext(ShopContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [method, setMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getCartAmount();
  const shipping = subtotal > 0 ? delivery_charges : 0;
  const total = subtotal + shipping;

  const items = Object.entries(cartItems)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const book = books.find((b) => b._id === id);
      return book ? { ...book, quantity: qty } : null;
    })
    .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Please log in to place your order");
      return;
    }

    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    const payload = {
      userId: user._id,
      items,
      amount: total,
      address: form,
    };

    setSubmitting(true);

    try {
      const route = method === "cod" ? "place" : "stripe";
      const { data } = await axios.post(
        `${backendUrl}/api/order/${route}`,
        payload,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        toast.error(data.message);
      } else if (method === "cod") {
        scroll(0, 0);
        setCartItems({});
        toast.success(
          "Order placed successfully! Payment will be collected on delivery",
          { duration: 5000 }
        );
        navigate("/order");
      } else {
        window.location.href = data.sessionUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        Complete Your Order
      </h1>
      <p className="text-center text-muted-foreground mb-10">
        Review your items and enter your shipping details
      </p>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between py-2 border-b"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {currency}
                          {item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {currency}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {currency}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping > 0
                        ? `${currency}${shipping.toFixed(2)}`
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>
                      {currency}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "firstName", label: "First Name" },
                      { id: "lastName", label: "Last Name" },
                      { id: "email", label: "Email", type: "email" },
                      { id: "phone", label: "Phone", type: "tel" },
                      {
                        id: "street",
                        label: "Street Address",
                        className: "md:col-span-2",
                      },
                      { id: "city", label: "City" },
                      { id: "state", label: "State/Province" },
                      { id: "zip", label: "ZIP/Postal Code" },
                      { id: "country", label: "Country" },
                    ].map((field) => (
                      <div key={field.id} className={field.className || ""}>
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                          required
                          id={field.id}
                          name={field.id}
                          type={field.type || "text"}
                          value={form[field.id]}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <RadioGroup
                    value={method}
                    onValueChange={setMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="cod"
                        id="cod"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="cod"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <PackageCheck className="mb-3 h-6 w-6" />
                        <span>Cash on Delivery</span>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Pay when you receive your order
                        </p>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem
                        value="stripe"
                        id="stripe"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="stripe"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        <span>Credit Card</span>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Secure payment with Stripe
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    Back to Cart
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="min-w-[200px]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${currency}${total.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;