const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  successCallback,
  checkCoursePurchase,
  getUserPurchases,
} = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/success-payment", successCallback);
router.get("/check-purchase/:userId/:courseId", checkCoursePurchase);
router.get("/user-purchases/:userId", getUserPurchases);

module.exports = router;
