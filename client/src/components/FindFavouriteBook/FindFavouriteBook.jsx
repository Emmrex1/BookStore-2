import React from "react";
import { Link } from "react-router-dom";
import Title from "../Title/Title";

const FindFavouriteBook = () => {
  return (
    <div className="px-4 lg:px-24 py-5">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left Side (Image) */}
        <div className="md:w-1/2">
          <img
            src="/goodreads2018.png"
            alt="Favorite Book"
            className="rounded md:w-10/12"
          />
        </div>

        <div className="md:w-1/2 space-y-6">
          <Title
            title1="Find Favourite"
            title2="Books Here"
            titleStyles="mb-8"
            paraStyles="!block"
          />
          <p className="text-lg text-white-700 dark:bg-gray-900">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit, harum. Molestiae facilis earum rem voluptatum soluta,
            illo quae sequi repudiandae perspiciatis vero? Obcaecati asperiores
            laudantium commodi tenetur quod soluta reiciendis.
          </p>

          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold">800+</h3>
              <p className="text-base">Book Listing</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-base">Registered Users</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">1200+</h3>
              <p className="text-base">PDF Downloads</p>
            </div>
          </div>

          {/* Explore Button */}
          <div className="pt-4">
            <Link to="/shop">
              <button className="bg-blue-700 text-white font-semibold px-6 py-3 rounded hover:bg-black transition-all duration-300 w-full sm:w-auto">
                Explore More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindFavouriteBook;
