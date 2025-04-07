/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Download, Copy, X } from "lucide-react";

const PaymentReceiptModal = ({ paymentDetails, setPaymentDetails }) => {
  const handleCopyDetails = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Add a toast notification here
  };

  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate a PDF receipt
    console.log("Downloading receipt...");
    // Implementation would go here
  };

  const formatDate = (date) => {
    return new Date(date || Date.now()).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!paymentDetails) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
        initial={{ scale: 0.8, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: -20 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Payment Receipt</h2>
          <button
            onClick={() => setPaymentDetails(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          {/* Success Message */}
          <div className="flex items-center mb-6">
            <CheckCircle size={24} className="text-green-600 mr-2" />
            <span className="text-green-600 font-semibold">
              Payment Successful
            </span>
          </div>

          {/* Course Info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {paymentDetails.courseName}
            </h3>
            <p className="text-sm text-gray-600">
              Thank you for enrolling in this course!
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold">
                ₹{paymentDetails.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date:</span>
              <span>{formatDate()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className="text-green-600 font-semibold">Successful</span>
            </div>
          </div>

          {/* Transaction IDs */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Order ID:</span>
              <div className="flex items-center">
                <span className="text-gray-800 font-mono mr-2 text-sm truncate max-w-xs">
                  {paymentDetails.orderId}
                </span>
                <button
                  onClick={() => handleCopyDetails(paymentDetails.orderId)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy size={14} />
                </button>
                {/* <strong>Signature:</strong> {paymentDetails.signature} */}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Payment ID:</span>
              <div className="flex items-center">
                <span className="text-gray-800 font-mono mr-2 text-sm truncate max-w-xs">
                  {paymentDetails.paymentId}
                </span>
                <button
                  onClick={() => handleCopyDetails(paymentDetails.paymentId)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              onClick={handleDownloadReceipt}
            >
              <Download size={18} className="mr-2" />
              Download Receipt
            </button>
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setPaymentDetails(null)}
            >
              Continue to Course
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// To use this component in CourseDetails.js:
/*
Replace:
<AnimatePresence>
  {paymentDetails && (
    <motion.div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
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

With:
<AnimatePresence>
  {paymentDetails && (
    <PaymentReceiptModal 
      paymentDetails={paymentDetails} 
      setPaymentDetails={setPaymentDetails} 
    />
  )}
</AnimatePresence>
*/

export default PaymentReceiptModal;
