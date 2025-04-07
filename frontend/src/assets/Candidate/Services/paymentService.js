import config from "../../../../config";

const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const createOrder = async (
  amount,
  currency,
  courseId,
  userId,
  token
) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/payment/create-order`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        amount,
        currency,
        courseId,
        userId,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Order creation failed");
    }

    localStorage.setItem("currentPaymentAmount", amount.toString());

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const verifyPayment = async (paymentDetails, token) => {
  try {
    // Get courseId and userId from localStorage to include in the request
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.userId;

    // Extract courseId from the URL if it's in the format /courses/{courseId}/...
    const pathParts = window.location.pathname.split("/");
    const courseIdIndex = pathParts.indexOf("courses") + 1;
    const courseId =
      courseIdIndex < pathParts.length ? pathParts[courseIdIndex] : null;

    // Include all required fields in the verification request
    const verificationData = {
      razorpay_payment_id: paymentDetails.razorpay_payment_id,
      razorpay_order_id: paymentDetails.razorpay_order_id,
      razorpay_signature: paymentDetails.razorpay_signature,
      courseId: courseId,
      userId: userId,
      // The amount should be available from the payment process
      // We'll need to store this in a state or pass it through the payment flow
      amount: localStorage.getItem("currentPaymentAmount"), // Store this when creating the order
    };

    const response = await fetch(
      `${config.apiUrl}/api/payment/verify-payment`,
      {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(verificationData),
      }
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Payment verification failed");
    }

    return data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

export const recordSuccessfulPayment = async (payment_Id, courseId, token) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/payment/success-payment`,
      {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          payment_Id,
          courseId, // Include courseId in the request
        }),
      }
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to record payment");
    }

    return data;
  } catch (error) {
    console.error("Error recording payment:", error);
    throw error;
  }
};

export const checkIfPurchased = async (userId, courseId, token) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/payment/check-purchase/${userId}/${courseId}`,
      {
        headers: getAuthHeaders(token),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking purchase:", error);
    throw error;
  }
};

export const getUserPurchases = async (userId, token) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/payment/user-purchases/${userId}`,
      {
        headers: getAuthHeaders(token),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    throw error;
  }
};

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = (options) => {
  // Get user data from localStorage for prefilling
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Update prefill with user data if available
  if (userData) {
    options.prefill = {
      name: userData.name || "Student",
      email: userData.email || "",
      // You can also add phone if available
      contact: userData.phone || "",
    };
  }

  const rzp = new window.Razorpay(options);
  rzp.open();
  return rzp;
};

// Helper function to store payment amount temporarily for verification
export const storePaymentAmount = (amount) => {
  localStorage.setItem("currentPaymentAmount", amount);
};

// Helper function to clear payment amount after verification
export const clearPaymentAmount = () => {
  localStorage.removeItem("currentPaymentAmount");
};
