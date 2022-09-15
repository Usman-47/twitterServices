//crud users and change role too
const router = require("express").Router();

const CreateWalletController = require("../controllers/createWallet/createWalletController");

//createWalletController
router.get("/getWalletById", CreateWalletController.getWallet);
router.post("/new", CreateWalletController.createWallet);
router.get("/airdrop", CreateWalletController.airDrop);
router.get("/initializeUserPool", CreateWalletController.initializeUserPool);
router.get("/createTweet", CreateWalletController.createTweet);
router.get("/claimReward", CreateWalletController.claimReward);

module.exports = router;
