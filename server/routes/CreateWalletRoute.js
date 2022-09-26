//crud users and change role too
const router = require("express").Router();

const CreateWalletController = require("../controllers/createWallet/createWalletController");

//createWalletController
router.post("/new", CreateWalletController.createWallet);
router.post("/airdrop", CreateWalletController.airDrop);
router.post("/initializeUserPool", CreateWalletController.initializeUserPool);
router.post("/createTweet", CreateWalletController.createTweet);
router.post("/tweetAction", CreateWalletController.tweetAction);

module.exports = router;
