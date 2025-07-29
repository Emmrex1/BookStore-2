import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session_id = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending"); // "success" | "error" | "pending"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.get(
          `/api/payment/verify?session_id=${session_id}&orderId=${orderId}`
        );
        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error?.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (session_id && orderId) {
      verifyPayment();
    } else {
      setStatus("error");
      setMessage("Invalid payment session.");
      setLoading(false);
    }
  }, [session_id, orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-xl text-center">
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-gray-600 text-lg">Verifying your payment...</p>
          </div>
        ) : status === "success" ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <h2 className="text-xl font-semibold text-green-600">
              Payment Verified!
            </h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate("/orders")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View Your Order
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-10 w-10 text-red-500" />
            <h2 className="text-xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
