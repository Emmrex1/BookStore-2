// import React, { useEffect, useState, useContext } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import Title from "../Title/Title";
// import Item from "../Items/Item";
// import { ShopContext } from "../../context/ShopContext";

// const PopularBooks = () => {
//   const { books } = useContext(ShopContext);
//   const [popularBooks, setPopularBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Slider configuration
//   const sliderSettings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 4,
//     responsive: [
//       { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
//       { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
//       { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
//     ],
//   };

//   // Load and filter popular books
//   useEffect(() => {
//     if (books && books.length > 0) {
//       const filtered = books.filter((book) => book.popular);
//       setPopularBooks(filtered.slice(0, 10)); // Load up to 10 popular books
//     }
//     setLoading(false);
//   }, [books]);

//   return (
//     <section className="py-10 px-4 sm:px-8 lg:px-20 bg-gray-50 dark:bg-gray-900">
//       <Title
//         title1="Popular"
//         title2="Books"
//         titleStyles="mb-8"
//         paraStyles="!block"
//       />

//       {loading ? (
//         <p className="text-center text-gray-500 dark:text-gray-400">
//           Loading books...
//         </p>
//       ) : popularBooks.length === 0 ? (
//         <p className="text-center text-gray-500 dark:text-gray-400">
//           No popular books available.
//         </p>
//       ) : (
//         <div className="relative">
//           <Slider {...sliderSettings}>
//             {popularBooks.map((book) => (
//               <div key={book._id} className="px-3">
//                 <Item book={book} />
//               </div>
//             ))}
//           </Slider>
//         </div>
//       )}
//     </section>
//   );
// };

// export default PopularBooks;
import React, { useEffect, useState, useContext, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading books...
        </p>
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
      <Slider {...sliderSettings}>
        {popularBooks.map((book) => (
          <div key={book._id} className="px-3">
            <Item book={book} />
          </div>
        ))}
      </Slider>
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
    </section>
  );
};

export default PopularBooks;
