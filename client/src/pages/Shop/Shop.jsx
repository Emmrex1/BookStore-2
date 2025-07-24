import React, { useContext, useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { LuSettings2 } from "react-icons/lu";
import { categories } from "../../assets/data";
import { ShopContext } from "../../context/ShopContext";
import Title from "../../components/Title/Title";
import Item from "../../components/Items/Item";
import Footer from "../../components/Footer";
import axios from "axios";

const Shop = () => {
  const { backendUrl } = useContext(ShopContext);

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getProductsFromBackend = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (category.length > 0)
        queryParams.append("category", category.join(","));

      const response = await axios.get(
        `${backendUrl}/api/product/list?${queryParams.toString()}`
      );
      if (response.data.success) {
        setBooks(response.data.products);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProductsFromBackend();
  }, [search, category]);

  const toggleFilter = (value) => {
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const applySorting = (booksList) => {
    switch (sortType) {
      case "low":
        return booksList.sort((a, b) => a.price - b.price);
      case "high":
        return booksList.sort((a, b) => b.price - a.price);
      default:
        return booksList;
    }
  };

  const sortedBooks = applySorting([...books]);

  const getPaginatedBooks = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedBooks.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

  return (
    <section className="max-padd-container bg-white dark:bg-slate-900">
      <div className="pt-28 px-4 sm:px-8 lg:px-16">
        {/* Search Box */}
        <div className="w-full mx-auto mb-12">
          <div className="inline-flex items-center justify-between bg-gray-400 text-white rounded-full p-3 px-5 shadow-md">
            <RiSearch2Line className="text-xl" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="text"
              placeholder="Search books..."
              className="flex-1 mx-12 bg-transparent border-none outline-none text-sm placeholder:text-white"
            />
            <LuSettings2 className="text-xl cursor-pointer" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-16">
          <h4 className="h4 mb-6 hidden sm:block text-gray-800 dark:text-white">
            Categories:
          </h4>
          <div className="flex flex-wrap justify-center sm:justify-start gap-6">
            {categories.map((cat) => (
              <label key={cat.name}>
                <input
                  value={cat.name.toLowerCase()}
                  onChange={(e) => toggleFilter(e.target.value)}
                  type="checkbox"
                  className="hidden peer"
                />
                <div className="flex flex-col items-center peer-checked:text-primary cursor-pointer transition-all">
                  <div className="bg-primary bg-opacity-10 p-5 rounded-full">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-10 w-10 object-cover"
                    />
                  </div>
                  <span className="mt-2 text-sm font-medium">{cat.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Title & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <Title
            title1="Our"
            title2="Book List"
            titleStyles="text-2xl font-bold"
            paraStyles="!block"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Sort by:
            </span>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="text-sm px-3 py-2 rounded bg-white border dark:bg-slate-800 dark:text-white"
            >
              <option value="relevant">Relevant</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {getPaginatedBooks().length > 0 ? (
            getPaginatedBooks().map((book) => (
              <Item key={book._id} book={book} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
              No books found for the selected filters or search.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-14 mb-10 flex-wrap gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (num) =>
                  num === 1 ||
                  num === totalPages ||
                  Math.abs(num - currentPage) <= 1
              )
              .map((num, i, arr) => {
                const prev = arr[i - 1];
                if (prev && num - prev > 1) {
                  return (
                    <span
                      key={`ellipsis-${num}`}
                      className="px-2 py-1 select-none"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === num
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default Shop;
