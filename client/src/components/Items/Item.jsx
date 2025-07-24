import React, { useContext } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";
import { toast } from "react-hot-toast";
import { ShopContext } from "../../context/ShopContext";
import { Link } from "react-router-dom";

const Item = ({ book }) => {
  const { currency, addToCart } = useContext(ShopContext);

  const handleAddToCart = () => {
    addToCart(book._id);
    toast.success(`${book.name} added to cart!`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl overflow-hidden transition-transform hover:-translate-y-1 duration-300">
      <Link to={`/product/${book._id}`}>
        <div className="p-4">
          <img
            src={book.images}
            alt={book.name}
            className="w-full h-64 object-cover bg-slate-500 rounded-md mb-3"
          />
        </div>
      </Link>

      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-semibold line-clamp-1">{book.name}</h3>
          <span
            onClick={handleAddToCart}
            className="text-primary hover:text-white hover:bg-primary p-2 rounded-full transition-all cursor-pointer"
            title="Add to Cart"
          >
            <TbShoppingBagPlus size={20} />
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <p>{book.category}</p>
          <p className="text-blue-700 dark:text-blue-500 font-bold">
            {currency}
            {book.price}.00
          </p>
        </div>

        <p className="text-sm line-clamp-1 text-gray-600 dark:text-gray-300">
          {book.description}
        </p>
      </div>
    </div>
  );
};

export default Item;
