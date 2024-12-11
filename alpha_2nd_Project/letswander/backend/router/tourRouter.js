const express= require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
// const reviewController = require("../Controllers/reviewController");
// const reviewRouter = require("./../router/reviewRouter");
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");
const app = express();

// router.use("/:tourId/reviews", reviewRouter);

router.route("/").get(tourController.getAllTours);
router.route("/").post(authController.protect, authController.restrictTo("admin", "lead-guide"), tourController.createTour);
router.route("/:id").delete(authController.protect ,authController.restrictTo("admin"),tourController.deleteById);
router.route("/:id").patch(bodyParser.json(), authController.protect, authController.restrictTo("admin", "lead-guide") ,tourController.editById);
router.route("/:id").get(authController.protect, tourController.getById);



module.exports = router;