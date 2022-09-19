//crud users and change role too
const router = require("express").Router();

const CreateWalletController = require("../controllers/createWallet/createWalletController");

//createWalletController
router.post("/new", CreateWalletController.createWallet);
router.get("/airdrop", CreateWalletController.airDrop);
router.post("/initializeUserPool", CreateWalletController.initializeUserPool);
router.get("/claimReward", CreateWalletController.claimReward);

module.exports = router;
