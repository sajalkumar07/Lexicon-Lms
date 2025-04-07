/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Text = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay script");
      return;
    }

    try {
      const createOrderRes = await fetch(
        "http://localhost:8080/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 100,
            currency: "INR",
            receipt: "67eb0ab5a7b0423207e8d50",
          }),
        }
      );

      const orderData = await createOrderRes.json();
      if (!orderData.success) return alert("Order creation failed");

      const { orderId, amount, currency } = orderData;

      const options = {
        key: "rzp_test_29tDaxOsVy66E9",
        amount,
        currency,
        name: "Demo App",
        description: "Test Transaction",
        order_id: orderId,
        handler: async function (response) {
          const verifyRes = await fetch(
            "http://localhost:8080/api/payment/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            await fetch("http://localhost:8080/api/payment/success-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            setPaymentDetails({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          } else {
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🛒 Razorpay Demo Shop
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["T-shirt", "Headphones", "Book", "Mug"].map((item, i) => (
            <motion.div
              key={item}
              className="bg-indigo-50 rounded-lg p-4 shadow hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="font-semibold text-lg text-indigo-900">{item}</h3>
              <p className="text-sm text-gray-600 mt-1">
                A great {item.toLowerCase()} just for ₹100!
              </p>
              <button
                onClick={handlePayment}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all"
              >
                Pay ₹100
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {paymentDetails && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                ✅ Payment Successful!
              </h2>
              <p>
                <strong>Order ID:</strong> {paymentDetails.orderId}
              </p>
              <p>
                <strong>Payment ID:</strong> {paymentDetails.paymentId}
              </p>
              <p>
                <strong>Signature:</strong> {paymentDetails.signature}
              </p>
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                onClick={() => setPaymentDetails(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Text;
