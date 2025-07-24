import { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from "@/shared/firebase/firebase";
import { ShopContext } from "@/context/ShopContext";
import axios from "axios";
import { toast } from "sonner";

function GoogleLoginButton() {
  const { setToken, setUser, backendUrl, navigate } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const payload = {
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL,
      };

      const res = await axios.post(
        `${backendUrl}/api/user/google-auth`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setToken(res.data.token); // ⬅️ Store token
        setUser(res.data.user); // ⬅️ Store user
        toast.success("Login with Google successful!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google auth failed:", err);
      toast.error("Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (

      <FcGoogle className="text-xl " onClick={handleGoogleLogin} />
    
  );
}

export default GoogleLoginButton;
