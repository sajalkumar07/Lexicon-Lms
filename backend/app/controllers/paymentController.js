const Razorpay = require("razorpay");
const crypto = require("crypto");
const Purchase = require("../models/PaymentSchema");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { amount, currency, receipt, courseId, userId } = req.body;

  // Validate required fields
  if (!amount || !courseId || !userId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields (amount, courseId, userId)",
    });
  }

  const options = {
    amount: amount, // amount in smallest currency unit
    currency: currency || "INR",
    receipt: receipt || `receipt_${Date.now()}`,
    notes: {
      courseId: courseId,
      userId: userId,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseId,
    userId,
    amount,
  } = req.body;

  // Validate required fields
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courseId ||
    !userId ||
    !amount
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required payment verification fields",
    });
  }

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      // Create purchase record in database
      const newPurchase = new Purchase({
        userId: userId,
        courseId: courseId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: amount,
        status: "completed",
        paymentDetails: {
          signature: razorpay_signature,
          verifiedAt: new Date(),
        },
      });

      await newPurchase.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified and purchase recorded successfully",
        purchaseId: newPurchase._id,
      });
    } catch (error) {
      console.error("Error creating purchase record:", error);
      return res.status(500).json({
        success: false,
        message: "Payment verified but failed to save purchase record",
        error: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  }
};

exports.successCallback = async (req, res) => {
  console.log("✅ Payment success callback:", req.body.payment_Id);
  res.json({ success: true, message: "Payment confirmed by frontend" });
};

exports.checkCoursePurchase = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Validate inputs
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Course ID are required",
      });
    }

    // Find a purchase record that matches both userId and courseId
    const purchase = await Purchase.findOne({
      userId: userId,
      courseId: courseId,
      status: "completed", // Ensure payment was completed successfully
    });

    return res.status(200).json({
      success: true,
      hasPurchased: !!purchase, // Convert to boolean
      purchaseDetails: purchase
        ? {
            purchaseDate: purchase.createdAt,
            orderId: purchase.orderId,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking course purchase:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking purchase status",
      error: error.message,
    });
  }
};

exports.getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find all purchases for this user
    const purchases = await Purchase.find({
      userId: userId,
      status: "completed", // Only include completed purchases
    }).populate({
      path: "courseId",
      populate: {
        path: "instructor",
        select: "firstName lastName email",
      },
    });

    // Map and format the response to match getCourses format
    const purchasedCourses = purchases.map((purchase) => {
      const course = purchase.courseId;
      return {
        _id: course._id,
        title: course.title,
        category: course.category,
        price: course.price,
        description: course.description,
        difficulty: course.difficulty,
        instructor: {
          _id: course.instructor._id,
          firstName: course.instructor.firstName,
          lastName: course.instructor.lastName,
          email: course.instructor.email,
        },
        courseThumbnail: course.courseThumbnail,
        videos: course.videos || [],
        totalDuration: course.totalDuration || 0,
        totalVideos: course.videos ? course.videos.length : 0,
        rating: course.rating || 0,
        students: course.students || 0,
        purchaseDate: purchase.createdAt,
        orderId: purchase.orderId,
        purchaseAmount: purchase.amount,
      };
    });

    return res.status(200).json({
      success: true,
      count: purchasedCourses.length,
      courses: purchasedCourses,
    });
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching purchase history",
      error: error.message,
    });
  }
};
