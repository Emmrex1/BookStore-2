import React, { useEffect, useState, useContext, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

import Title from "../Title/Title";
import Item from "../Items/Item";
import { ShopContext } from "../../context/ShopContext";

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const PopularBooks = () => {
  const { books, loading } = useContext(ShopContext);
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    if (books && books.length > 0) {
      const filtered = books.filter((book) => book.popular);
      setPopularBooks(filtered.slice(0, 10));
    }
  }, [books]);

  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={300} borderRadius={12} />
          ))}
        </div>
      );
    }

    if (!popularBooks.length) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No popular books available.
        </p>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Slider {...sliderSettings}>
          {popularBooks.map((book) => (
            <div key={book._id} className="px-3">
              <Item book={book} showWishlist={true} showRating={true} />
            </div>
          ))}
        </Slider>
      </motion.div>
    );
  }, [popularBooks, loading]);

  return (
    <section className="py-10 px-4 sm:px-8 lg:px-20 bg-gray-50 dark:bg-gray-900">
      <Title
        title1="Popular"
        title2="Books"
        titleStyles="mb-8"
        paraStyles="!block"
      />
      {renderContent}

      <div className="text-center mt-8">
        <Link
          to="/shop"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
        >
          View More
        </Link>
      </div>
    </section>
  );
};

export default PopularBooks;
