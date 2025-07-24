import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

const Error404 = () => {
  return (
    <section className=" flex items-center justify-center bg-white dark:bg-slate-900 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 max-w-md"
      >
        <h1 className="text-7xl font-extrabold text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          <FaArrowLeft />
          Go Back Home
        </Link>
      </motion.div>
    </section>
  );
};

export default Error404;
