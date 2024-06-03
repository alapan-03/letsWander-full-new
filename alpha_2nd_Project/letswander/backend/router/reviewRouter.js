const reviewController = require("../controllers/reviewController");
const express = require("express")
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");
const app = express();

const router = express.Router({ mergeParams: true});
// const router = express.Router();

router.use(authController.protect);

router.route("/").get(reviewController.getAllReview);
router.route("/").post(bodyParser.json(), authController.protect, reviewController.createReview);
// router.route("/:id").delete(reviewController.deleteReview)

module.exports = router;