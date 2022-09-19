const fetch = require("node-fetch");
const express = require("express");
const Reward = require("../model/reward");

var router = express.Router();

router.get("/", async function (req, res) {
  try {
    const { projectName, poolAddress } = req.body;
    var reward = await Reward.find({
      $and: [
        {
          users: { $elemMatch: { projectName } },
        },
        {
          users: { $elemMatch: { poolAddress } },
        },
      ],
    });

    return res.send(reward);
  } catch (error) {
    console.log(error.message);
  }
});
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
      userPublicKey,
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
              userPublicKey,
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
            userPublicKey,
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
