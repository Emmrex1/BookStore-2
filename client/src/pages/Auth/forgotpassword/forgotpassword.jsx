import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MailIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import axios from "axios";
import { ShopContext } from "@/context/ShopContext";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPassword = () => {
  const {backendUrl} = useContext(ShopContext)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email: data.email,
      });

      toast.success(
        "✅ " + res.data.message || "Reset link sent to your email."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || "❌ Something went wrong.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl space-y-5"
      >
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-gray-600 hover:text-blue-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Forgot Password</h1>
        </div>

        <p className="text-gray-500 text-sm">
          Enter your registered email. We’ll send a password reset link.
        </p>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className={`w-full border px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                {...register("email")}
              />
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute right-3 top-2.5"
              >
                <MailIcon className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
            {isLoading ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
