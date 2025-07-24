import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "../components/BannerCard.css";

import bake1 from "../assets/bannerbook/bake1.jpg";
import bake2 from "../assets/bannerbook/bake2.jpg";
import bake3 from "../assets/bannerbook/bake3.jpg";
import bake4 from "../assets/bannerbook/bake4.jpg";
import bake5 from "../assets/bannerbook/bake5.jpg";
import bake6 from "../assets/bannerbook/bake6.jpg";
import bake7 from "../assets/bannerbook/bake7.jpg";
import bake8 from "../assets/bannerbook/bake8.jpg";

const BannerCard = () => {
  const images = [bake1, bake2, bake3, bake4, bake5, bake6, bake7, bake8];
  return (
    <div className="flex justify-center py-8">
      <Swiper
        effect="cards"
        grabCursor={true}
        modules={[EffectCards, Autoplay, Pagination]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        className="swiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCard;
