import React from "react";
// import Navbar from "../components/Navbar";
import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import Unveiling from "../../components/Unveiling/Unveiling";
import PopularBooks from "../../components/PopularBooks/PopularBooks";
import FindFavouriteBook from "../../components/FindFavouriteBook/FindFavouriteBook";
import Features from "../../components/Features/Features";

function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <Banner />
      <NewArrivals />
      <Unveiling />
      <PopularBooks />
      <FindFavouriteBook/>
      <Features/>
      <Footer />
    </>
  );
}

export default Home;
