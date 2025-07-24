// import React, { useContext, useEffect, useState } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import Item from "../Items/Item";
// import Title from "../Title/Title";
// import { ShopContext } from "../../context/ShopContext";

// const NewArrivals = () => {
//   const { books } = useContext(ShopContext);
//   const [newArrivals, setNewArrivals] = useState([]);
//   const [loading, setLoading] = useState(true);

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

//   useEffect(() => {
//     if (books && books.length > 0) {
//       setNewArrivals(books); // ✅ Use all available books
//     }
//     setLoading(false);
//   }, [books]);

//   return (
//     <section className="py-10 px-4 sm:px-8 lg:px-20 bg-gray-50 dark:bg-gray-900">
//       <Title
//         title1="New"
//         title2="Arrivals"
//         titleStyles="mb-8"
//         paraStyles="!block"
//       />

//       {loading ? (
//         <p className="text-center text-gray-500 dark:text-gray-400">
//           Loading books...
//         </p>
//       ) : newArrivals.length === 0 ? (
//         <p className="text-center text-gray-500 dark:text-gray-400">
//           No books available.
//         </p>
//       ) : (
//         <Slider {...sliderSettings}>
//           {newArrivals.map((book) => (
//             <div key={book._id} className="px-3">
//               <Item book={book} />
//             </div>
//           ))}
//         </Slider>
//       )}
//     </section>
//   );
// };

// export default NewArrivals;
import React, { useContext, useEffect, useState, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Item from "../Items/Item";
import Title from "../Title/Title";
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

const NewArrivals = () => {
  const { books, loading } = useContext(ShopContext);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    if (books && books.length > 0) {
      setNewArrivals(books.slice(0, 12));
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

    if (!newArrivals.length) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No books available.
        </p>
      );
    }

    return (
      <Slider {...sliderSettings}>
        {newArrivals.map((book) => (
          <div key={book._id} className="px-3">
            <Item book={book} />
          </div>
        ))}
      </Slider>
    );
  }, [newArrivals, loading]);

  return (
    <section className="py-10 px-4 sm:px-8 lg:px-20 bg-gray-50 dark:bg-gray-900">
      <Title
        title1="New"
        title2="Arrivals"
        titleStyles="mb-8"
        paraStyles="!block"
      />
      {renderContent}
    </section>
  );
};

export default NewArrivals;
