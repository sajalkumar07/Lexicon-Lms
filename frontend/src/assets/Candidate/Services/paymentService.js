import config from "../../../../config";

export const createOrder = async (amount, currency, receipt) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency,
        receipt,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Order creation failed");
    }

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const verifyPayment = async (paymentDetails) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/payment/verify-payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
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

export const recordSuccessfulPayment = async (
  paymentDetails,
  courseId,
  amount
) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/payment/success-payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentDetails,
          courseId,
          amount,
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
  const rzp = new window.Razorpay(options);
  rzp.open();
  return rzp;
};
