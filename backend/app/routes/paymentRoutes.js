const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  successCallback,
} = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/success-payment", successCallback);

module.exports = router;
