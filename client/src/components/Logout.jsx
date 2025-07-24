// import axios from "axios";
// import { toast } from "sonner";

// const logout = async () => {
//   try {
//     await axios.post(`${backendUrl}/api/user/logout`, null, {
//       withCredentials: true,
//     });

//     // Clear localStorage or context values
//     localStorage.removeItem("token");
//     setUser(null);
//     setToken(null);

//     toast.success("Logged out successfully");
//     navigate("/login");
//   } catch (error) {
//     toast.error("Logout failed");
//     console.error("Logout error:", error);
//   }
// };
