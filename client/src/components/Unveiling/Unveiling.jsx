import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Title from "../Title/Title";
import returnImg from "../../assets/bannerbook/revieew.png";
import paymentImg from "../../assets/bannerbook/secure.png";
import supportImg from "../../assets/bannerbook/filter.png";
import awardbook from "../../assets/bannerbook/book award.png";

const Unveiling = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const features = [
    {
      img: returnImg,
      title: "Easy Return Option",
      description:
        "Enjoy hassle-free returns on every order with our simplified return policy.",
      delay: 0,
    },
    {
      img: paymentImg,
      title: "Secure Payment Option",
      description:
        "All transactions are protected with top-tier encryption for your safety.",
      delay: 100,
    },
    {
      img: supportImg,
      title: "Live Customer Support",
      description:
        "Our support team is always ready to assist you—anytime, anywhere.",
      delay: 200,
    },
  ];

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 py-12 xl:py-24 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Content */}
        <div className="flex-1 w-full">
          <Title
            title1="Unveiling Our"
            title2="Store's Key Features"
            titleStyles="mb-6 md:mb-10"
            paraStyles="!block"
          />

          <div className="flex flex-col gap-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={feature.delay}
                className="flex items-start gap-x-4"
              >
                <div className="h-16 w-16 bg-gray-200 dark:bg-slate-700 flex items-center justify-center rounded-md p-2">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div
          className="flex-1 flex justify-center"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full">
            <img
              src={awardbook}
              alt="Award Book"
              className="w-full h-auto rounded-lg shadow-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Unveiling;
