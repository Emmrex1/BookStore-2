
import React, { useContext, useEffect, useState, useMemo } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Item from "../Items/Item";
import Title from "../Title/Title";
import { ShopContext } from "../../context/ShopContext";
import { Link } from "react-router-dom";

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

const NewArrivals = () => {
  const { books, loading } = useContext(ShopContext);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    if (books?.length > 0) {
      setNewArrivals(books.slice(0, 12));
    }
  }, [books]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="p-4">
          <Skeleton height={260} className="rounded-md" />
          <Skeleton count={2} style={{ marginTop: "10px" }} />
        </div>
      ))}
    </div>
  );

  const renderContent = useMemo(() => {
    if (loading) return renderSkeletons();

    if (!newArrivals.length) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No books available.
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
          {newArrivals.map((book) => (
            <div key={book._id} className="px-3">
              <Item book={book} isNew />
            </div>
          ))}
        </Slider>
      </motion.div>
    );
  }, [newArrivals, loading]);

  return (
    <section className="py-10 px-7 sm:px-8 lg:px-20 bg-gray-50 dark:bg-gray-900">
      <Title
        title1="New"
        title2="Arrivals"
        titleStyles="mb-8"
        paraStyles="!block"
      />
      {renderContent}
      {!loading && (
        <div className="text-center mt-8">
          <Link
            to="/shop"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
          >
            View More
          </Link>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
