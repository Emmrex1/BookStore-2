
import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { ShopContext } from "@/context/ShopContext";

const schema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/reset-password/${token}`,
        data
      );

      toast.success(res.data.message || "Password reset successful");
      setResetSuccess(true);
       setTimeout(() => navigate("/login"), 10000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Move this above the main return
  if (resetSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
        <div className="max-w-md bg-white p-6 rounded-md shadow-md text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-3">
            🎉 Password Reset Successful!
          </h2>
          <p className="text-gray-700 mb-4">
            You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 bg-white rounded-md shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>

        <div className="mb-4 relative">
          <label htmlFor="newPassword" className="block font-medium">
            New Password
          </label>
          <input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            {...register("newPassword")}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-sm text-blue-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
