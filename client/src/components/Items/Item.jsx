import React, { useContext, useState } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { ShopContext } from "../../context/ShopContext";
import { Link } from "react-router-dom";

const Item = ({ book, isNew }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart(book._id);
    toast.success(`${book.name} added to cart!`, {
      duration: 2000,
      style: {
        background: "#0f172a",
        color: "#fff",
      },
    });
  };

  const toggleWishlist = () => {
    setWishlisted((prev) => !prev);
    toast.success(wishlisted ? "Removed from Wishlist" : "Added to Wishlist", {
      duration: 1500,
      style: {
        background: "#0f172a",
        color: "#fff",
      },
    });
  };

  const renderStars = () => {
    const stars = [];
    const rating = Math.round(book.rating || 0); 
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <div className="bg-white dark:bg-slate-800 relative group shadow-md rounded-xl overflow-hidden transition-transform hover:-translate-y-1 duration-300 border dark:border-slate-700">
      {/* New Badge */}
      {isNew && (
        <span className="absolute top-3 left-3 text-xs bg-green-600 text-white px-2 py-1 rounded-full z-10">
          New
        </span>
      )}

      {/* Wishlist Icon */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 text-red-500 bg-white dark:bg-slate-700 p-1 rounded-full hover:scale-110 transition"
        title="Toggle Wishlist"
        aria-label="Toggle Wishlist"
      >
        {wishlisted ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
      </button>

      {/* Book Image */}
      <Link to={`/product/${book._id}`} className="block">
        <div className="p-4">
          <img
            src={book.images}
            alt={book.name}
            loading="lazy"
            className="w-full h-64 object-cover rounded-md mb-3 bg-slate-200 dark:bg-slate-700"
          />
        </div>
      </Link>

      {/* Book Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-semibold line-clamp-1">{book.name}</h3>
          <button
            onClick={handleAddToCart}
            className="text-primary hover:text-white hover:bg-primary p-2 rounded-full transition-all"
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            <TbShoppingBagPlus size={20} />
          </button>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <p>{book.category}</p>
          <p className="text-blue-700 dark:text-blue-500 font-bold">
            {currency}
            {book.price}.00
          </p>
        </div>

        {/* Star Rating */}
        <div className="mb-2">{renderStars()}</div>

        <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-300">
          {book.description}
        </p>
      </div>
    </div>
  );
};

export default Item;
