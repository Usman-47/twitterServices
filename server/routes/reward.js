const fetch = require("node-fetch");
const express = require("express");
const Reward = require("../model/reward");

var router = express.Router();

router.patch("/addRewardRecord", async function (req, res) {
  try {
    const {
      tweetId,
      isPaid,
      reawrdAmount,
      projectName,
      mintAddress,
      poolAddress,
      isRaid,
      invoiceCreaterPublicKey,
    } = req.body;
    var reward = await Reward.findOneAndUpdate(
      {
        $and: [
          {
            users: { $elemMatch: { projectName } },
          },
          {
            users: { $elemMatch: { poolAddress } },
          },
        ],
      },
      {
        $push: {
          users: [
            {
              tweetId,
              isPaid,
              reawrdAmount,
              projectName,
              mintAddress,
              poolAddress,
              isRaid,
              invoiceCreaterPublicKey,
            },
          ],
        },
      }
    );
    if (!reward) {
      reward = new Reward({
        users: [
          {
            tweetId,
            isPaid,
            reawrdAmount,
            projectName,
            mintAddress,
            poolAddress,
            isRaid,
            invoiceCreaterPublicKey,
          },
        ],
      });
      await reward.save();
    }
    return res.send(reward);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;