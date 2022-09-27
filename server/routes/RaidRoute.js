//crud users and change role too
const router = require("express").Router();

const RaidController = require("../controllers/raidController/RaidController");

//createWalletController
router.post("/new", RaidController.createWallet);
router.post("/airdrop", RaidController.airDrop);
router.post("/initializeUserPool", RaidController.initializeUserPool);
router.post("/createTweet", RaidController.createTweet);
router.post("/tweetAction", RaidController.tweetAction);

module.exports = router;
