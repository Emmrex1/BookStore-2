
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { ShopContext } from "@/context/ShopContext";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import GoogleLoginButton from "@/shared/GoogleLoginButton/GoogleLoginButton";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setToken, setUser, backendUrl } = useContext(ShopContext);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/login`, data, {
        withCredentials: true,
      });
      if (res?.data?.token && res?.data?.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Placeholder functions for social logins
  const handleFacebookLogin = () => toast.info("Facebook login coming soon");
  const handleGitHubLogin = () => toast.info("GitHub login coming soon");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-slate-900">
      <div className="w-full max-w-md bg-white rounded-lg p-8 space-y-6 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Link to="/">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sign In to <span className="text-blue-600">BookStore</span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline dark:text-white"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline dark:text-white"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Social Logins - Updated Section */}
        <div className="space-y-3">
          <h4 className="text-center font-medium text-gray-600 dark:text-white">
            Continue with
          </h4>
          <div className="flex justify-center space-x-5">
            {/* Google */}
            <GoogleLoginButton
              className="group p-3 rounded-full border border-gray-300 hover:border-blue-400 transition-all duration-300 hover:shadow-lg dark:border-gray-600"
              aria-label="Sign in with Google"
            >
              <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
            </GoogleLoginButton>

            {/* Facebook */}
            <button
              onClick={handleFacebookLogin}
              className="group p-3 rounded-full border border-gray-300 hover:border-blue-600 transition-all duration-300 hover:shadow-lg dark:border-gray-600"
              aria-label="Sign in with Facebook"
            >
              <FaFacebook className="text-2xl text-blue-600 group-hover:scale-110 transition-transform" />
            </button>

            {/* GitHub */}
            <button
              onClick={handleGitHubLogin}
              className="group p-3 rounded-full border border-gray-300 hover:border-gray-800 transition-all duration-300 hover:shadow-lg dark:border-gray-600"
              aria-label="Sign in with GitHub"
            >
              <FaGithub className="text-2xl text-gray-800 dark:text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;