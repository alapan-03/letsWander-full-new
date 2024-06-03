const messageController = require("../controllers/messageController");
const express = require("express")
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");
// const stripe = require("./../backndStripe/stripe");
const app = express();

const router = express.Router({ mergeParams: true});
// router.route("/stripe").post(bodyParser.json(), stripe.stripe);

router.use(authController.protect);
router.use(bodyParser.json())

router.route("/createMessages/:tourId").post(messageController.createMessages);
router.route("/getMessages/:tourId").get(messageController.getMessagesByTour);
// router.route("/").post(bodyParser.json(), bookedController.createBooked);


module.exports = router;