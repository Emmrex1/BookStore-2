import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "../Title/Title";

const CartTotal = () => {
  const { currency, getCartAmount, delivery_charges } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const shipping = subtotal === 0 ? 0 : delivery_charges;
  const total = subtotal + shipping;

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden relative">
      {/* Top Stripe */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />

      {/* Title */}
      <div className="p-6">
        <Title title1="Cart" title2="Summary" title1Styles="h3" />

        {/* Subtotal */}
        <div className="flex justify-between items-center mt-5 text-gray-700 dark:text-gray-300">
          <h5 className="font-medium text-base">Subtotal</h5>
          <span className="text-sm font-semibold hover:scale-105 transition-transform">
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="my-3 border-t border-gray-200 dark:border-gray-700" />

        {/* Shipping */}
        <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
          <h5 className="font-medium text-base">Shipping Fee</h5>
          <span className="text-sm font-semibold hover:scale-105 transition-transform">
            {currency}
            {shipping.toFixed(2)}
          </span>
        </div>

        <div className="my-3 border-t border-gray-200 dark:border-gray-700" />

        {/* Total */}
        <div className="flex justify-between items-center text-lg mt-3">
          <h5 className="font-bold text-gray-800 dark:text-white">Total</h5>
          <span className="text-white bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full shadow font-semibold text-sm hover:scale-105 transition-transform">
            {currency}
            {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
