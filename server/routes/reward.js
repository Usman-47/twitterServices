const express = require("express");
const Reward = require("../model/reward");
const CheckRoleAccess = require("../util/CheckRoleAccess");

var router = express.Router();

router.get("/:projectName/:mintAddress", async function (req, res) {
  try {
    const { projectName, mintAddress } = req.params;
    var limit = 50;
    var reward = await Reward.find({
      users: { $elemMatch: { projectName, mintAddress } },
    });
    let tempArray = [];
    if (reward && reward.length > 0) {
      reward.map((data) => {
        if (data.users && data.users.length > 0) {
          data.users.map((user) => {
            if (user.isPaid === false) {
              if (tempArray && tempArray.length < limit) {
                tempArray.push(user);
              }
            }
          });
        }
      });
    }
    return res.send({ reward: tempArray });
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
    // for (let i = 0; i < 50; i++) {
    // console.log(i);
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
    // }
  } catch (error) {
    console.log(error.message);
  }
});

router.patch("/updateRewardRecord", async function (req, res) {
  try {
    const { role } = req.userObj;
    const isEligible = CheckRoleAccess(["admin", "manager"], role);
    if (!isEligible) {
      return res.status(401).send({
        msg: "You are not allowed to access this service...contact your admin..",
        type: "error",
      });
    }
    var reward;
    const { projectName, mintAddress, usersArray } = req.body;
    for (let i = 0; i < usersArray.length; i++) {
      console.log(usersArray[i].tweetIds, usersArray[i].users);
      reward = await Reward.findOneAndUpdate(
        {
          users: {
            $elemMatch: {
              tweetId: usersArray[i].tweetIds,
              userPublicKey: usersArray[i].users,
              projectName,
              mintAddress,
              isPaid: false,
            },
          },
        },
        {
          $set: {
            "users.$.isPaid": true,
          },
        },
        {
          new: true,
        }
      );
    }
    return res.send(reward);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
