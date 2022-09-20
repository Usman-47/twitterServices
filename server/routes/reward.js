const fetch = require("node-fetch");
const express = require("express");
const Reward = require("../model/reward");

var router = express.Router();

router.get("/:projectName/:mintAddress", async function (req, res) {
  try {
    const { projectName, mintAddress } = req.params;
    // var limit = 50;
    // var skip = pageNo * (limit - 1);
    var reward = await Reward.find({
      $and: [
        {
          users: { $elemMatch: { projectName } },
        },
        {
          users: { $elemMatch: { mintAddress } },
        },
        {
          users: { $elemMatch: { isPaid: false } },
        },
      ],
    });
    // }).skip(skip).limit(limit);

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
            users: { $elemMatch: { mintAddress } },
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
