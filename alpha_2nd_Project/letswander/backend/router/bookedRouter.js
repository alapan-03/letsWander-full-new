const bookedController = require("../controllers/bookedController");
const express = require("express")
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");
const stripe = require("../backndStripe/stripe");
const app = express();

const router = express.Router({ mergeParams: true});
// const router = express.Router();
router.route("/stripe").post(bodyParser.json(), stripe.stripe);

router.use(authController.protect);

router.route("/").get(bookedController.getAllBooked);
router.route("/").post(bodyParser.json(), bookedController.createBooked);
// router.route("/currBooked").get(bookedController.getCurrUserBooked);
// router.route("/:id").delete(reviewController.deleteReview)

module.exports = router;