import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ResetSuccess = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-green-50"
    >
      <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold text-green-700">
        Password Reset Successful!
      </h2>
      <p className="text-sm text-gray-600 my-2">
        You can now log in with your new password.
      </p>
      <Link to="/login">
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Go to Login
        </button>
      </Link>
    </motion.div>
  );
};

export default ResetSuccess;
``