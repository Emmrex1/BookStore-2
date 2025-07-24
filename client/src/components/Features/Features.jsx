import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import filterIcon from "../../assets/bannerbook/filter.png";
import ratingIcon from "../../assets/bannerbook/revieew.png";
import wishlistIcon from "../../assets/bannerbook/wishlist.png";
import paymentIcon from "../../assets/bannerbook/secure.png";

const Features = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const features = [
    {
      icon: filterIcon,
      title: "Advanced Search and Filters",
      description:
        "Effortlessly search books by title, author, genre, or price range.",
      animation: "fade-up",
      delay: 0,
    },
    {
      icon: ratingIcon,
      title: "User Reviews and Ratings",
      description:
        "Customers can share reviews, rate books, and guide future readers.",
      animation: "fade-up",
      delay: 100,
    },
    {
      icon: wishlistIcon,
      title: "Wishlist and Favorites",
      description:
        "Save books to wishlist for future purchases or easy access.",
      animation: "fade-up",
      delay: 200,
    },
    {
      icon: paymentIcon,
      title: "Secure Online Payments",
      description:
        "Enjoy seamless checkout with multiple secure payment options.",
      animation: "fade-up",
      delay: 300,
    },
  ];

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-20 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            data-aos={feature.animation}
            data-aos-delay={feature.delay}
            className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer dark:bg-gray-900"
          >
            <img
              src={feature.icon}
              alt={feature.title}
              className="w-10 h-10 object-contain mt-1"
            />
            <div>
              <h4 className="font-semibold text-lg">{feature.title}</h4>
              <p className="text-sm text-gray-600 dark:text-white">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
