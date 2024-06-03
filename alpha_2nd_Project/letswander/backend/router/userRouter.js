const express= require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const googleController = require("../controllers/googleUser");
const upload = require("../utils/multer");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const stripe = require("../backndStripe/stripe");
// const { uploadOnCloudinary } = require("./path/to/cloudinarySetup");

const bodyParser = require("body-parser");


// router.route("/token").get(authController.token);
router.route("/signup").post(bodyParser.json(), authController.signup);
router.route("/login").post(bodyParser.json(), authController.login);
router.route("/loginGoogle").post(bodyParser.json(), authController.loginGoogle);
router.route("/signupGoogle").post(bodyParser.json(), authController.signupGoogle);
// router.route("/forgotPass").post(bodyParser.json(), authController.forgotPassword);

// router.route("/booked").post(bodyParser.json(), authController.protect, authController.bookedTours)
router.route("/me").get(authController.protect,userController.getMe)
router.route("/:tourId/addToBook").patch(bodyParser.json(), authController.protect, userController.updateMe);
router.route("/update").patch(bodyParser.json(), authController.protect, userController.updateUser);
router.route("/cancelBooking/:id").delete(bodyParser.json(), authController.protect, userController.cancelBooking);

router.post("/upload", upload.single('file'), authController.protect,userController.upload)

// router.use(authController.restrictTo("admin"))

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUser);
router.route("/:id").delete(userController.deleteUser);


router.route("/stripePayment").post(bodyParser.json(), authController.protect, stripe.stripe)
router.route("/verifyStripe2").post(bodyParser.json(), authController.protect, stripe.verifyStripe2)

module.exports = router;