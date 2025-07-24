import React from "react";
import banner from "../assets/bannerbook/Banner.png";
// import BannerCard from "./BannerCard";
import { Link } from "react-router-dom";
function Banner() {
  return (
    <>
      <div className=" max-w-screen-2xl  container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-10">
        <div className="w-full order-2 md:order-1 md:w-1/2 mt-12 md:mt-36">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              Hello, welcomes here to learn something
              <span className="text-blue-500 px-2">new everyday!!!</span>
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
              Join a community of readers and learners. Whether you're looking
              for a textbook, novel, or educational guide — we have something
              for everyone.
            </p>
            
 
          </div>
          <Link to={'/store'}>
           <button className="btn mt-6 btn-secondary">Explore Now</button> 
           </Link>
        </div>
         <div className=" order-2 w-full mt-20 md:w-1/2">
         <img src={banner} alt="" className="object-cover px-4"/>
          {/* <BannerCard /> */}
        </div> 
      </div>
    </>
  );
}

export default Banner;
