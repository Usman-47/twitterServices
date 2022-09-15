import React, { useEffect, useState } from "react";
import axios from "axios";
// import moment from "moment";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import { toast } from "react-toastify";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  useWalletModal,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import * as solanaWeb3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  NATIVE_MINT,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import IDL from "./twitter_program_for_raid.json";

// -----table imports ---------
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Icon } from "@iconify/react";
// <<<<<<< HEAD
import ThreadModal from "./ThreadModal";

// =======
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
const moment = require("moment");
// ====================

const Tweet = ({ currentUser, data, projectDetail, poolData }) => {
  console.log(poolData, "pooldata");
  const [getTweetLikes, setGetTweetLikes] = useState();
  const [retweetStatus, setRetweetStatus] = useState();
  const [quoteTweets, setQuoteTweets] = useState();
  const [isTweetLike, setIsTweetLike] = useState();
  const [projectName, setProjectName] = useState();
  const [isTweetRetweeted, setIsTweetRetweeted] = useState();
  const [allReplyOfATweet, setAllReplyOfATweet] = useState();
  const [currentUserFallowers, setCurrentUserFallowers] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [updateReplyFlag, setUpdateReplyFlag] = useState();
  const [rewards, setreward] = useState();
  const [tweetsStatus, settweetStatus] = useState();

  const { wallet, connect, sendTransaction, connecting, publicKey } =
    useWallet();

  const solConnection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "processed"
  );
  let cloneWindow = window;
  let provider = new anchor.Provider(
    solConnection,
    cloneWindow["solana"],
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL,
    "5UR1VYhWxH9iy5C7mdQWDztgDHLeGZoSyEjye4vzHcjs",
    provider
  );

  const getCurrentUserFollower = async () => {
    if (!currentUser?.twitterId) {
      alert("Please sigin first");
      return;
    }
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getUserFollowers/${currentUser?.twitterId}`
    );
    setCurrentUserFallowers(res?.data?.data?.length);
  };

  useEffect(() => {
    if (currentUser?.twitterId) {
      getCurrentUserFollower();
    }
  }, [currentUser?.twitterId]);

  useEffect(() => {
    if (projectDetail) {
      setProjectName(projectDetail.projectName);
    }
  }, [projectDetail]);

  const handleModal = (data) => {
    setOpenModal(data);
  };

  const handleReplyData = async (data) => {
    await replyToSpecificTweet(data);
    setUpdateReplyFlag(!updateReplyFlag);
  };

  // <<<<<<< HEAD
  // ==========for table =========
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function createData(name, calories, fat, carbs, protein, proteins) {
    return { name, calories, fat, carbs, protein, proteins };
  }
  const rows = [
    createData(
      <a href={data?.tweetUrl}>{data?.tweetText}</a>,
      <Icon
        className="check_icon"
        id="check_icon"
        icon="akar-icons:check-box"
      />,
      <Icon className="check_icon" icon="akar-icons:check-box" />,
      <Icon className="check_icon" icon="akar-icons:check-box" />,
      <Icon className="check_icon" icon="akar-icons:check-box" />,
      <Icon className="check_icon" icon="akar-icons:check-box" />,
      <Icon className="check_icon" icon="akar-icons:check-box" />,
      <Icon className="check_icon" icon="akar-icons:check-box" />
    ),
  ];

  const checkTweetLiked = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getTweetliked/${data?.tweetId}`
    );
    setGetTweetLikes(res.data.data);
  };

  useEffect(() => {
    var isTweetLiked = false;
    if (data?.tweetId) {
      currentUser?.raidStatus?.likeStatus?.map((tweetStatus) => {
        if (tweetStatus.tweetId === data?.tweetId) {
          setIsTweetLike(true);
          isTweetLiked = true;
        }
      });
    }
    if (!isTweetLiked) {
      var tweetLikeStatus = false;
      if (getTweetLikes) {
        getTweetLikes.map((tweet) => {
          if (tweet?.username === currentUser.userName) {
            tweetLikeStatus = true;
          }
        });
        if (tweetLikeStatus) {
          setIsTweetLike(true);
        } else {
          setIsTweetLike(false);
        }
      }
    }
  }, [getTweetLikes, currentUser, data?.tweetId]);

  const checkTweetRetweet = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getRetweets/${data?.tweetId}`
    );
    setRetweetStatus(res?.data?.data);
  };

  useEffect(() => {
    var tweetIsRetweeted = false;
    if (data?.tweetId) {
      currentUser?.raidStatus?.retweetStatus?.map((tweetStatus) => {
        console.log(tweetStatus, "tweetStatustweetStatustweetStatus");

        if (tweetStatus?.tweetId === data?.tweetId) {
          console.log("chalta ha");

          setIsTweetRetweeted(true);
          settweetStatus(tweetStatus?.rewardAmount);

          tweetIsRetweeted = true;
        }
      });
    }
    if (!tweetIsRetweeted) {
      var tweetRetweetStatus = false;
      if (retweetStatus) {
        retweetStatus?.map((status) => {
          if (status?.username === currentUser.userName) {
            tweetRetweetStatus = true;
          }
        });
        if (tweetRetweetStatus) {
          setIsTweetRetweeted(true);
        } else {
          setIsTweetRetweeted(false);
        }
      }
    }
  }, [retweetStatus, currentUser, data?.tweetId]);
  console.log(tweetsStatus, "tweetsStatussssssssssssssssss");

  useEffect(() => {
    if (data?.tweetId) {
      checkTweetLiked();
      checkTweetRetweet();
    }
  }, [data?.tweetId, currentUser]);

  useEffect(() => {
    if (currentUser && publicKey) {
      let data = {
        twitterId: currentUser.twitterId,
        publicKey: publicKey.toString(),
      };
      axios
        .patch(
          `${process.env.REACT_APP_SERVERURL}/api/addUserWalletPublicKey`,
          data
        )
        .then((response) => console.log(response, "responseresponse"));
    }
  }, [publicKey, currentUser]);

  const checkUserNumberOfFollower = async () => {
    if (!currentUser) {
      alert("Please sigin first");
      return;
    }
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getUserFollowers/${currentUser.twitterId}`
    );
    alert(res.data.data.length);
  };

  const checkQuoteTweets = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getQuotedTweetsByTweetId/${data?.tweetId}`
    );
    if (res?.data?.data) {
      return res?.data.data;
    } else {
      return false;
    }
  };

  const LikeTweet = async (number) => {
    var reward = 0;

    if (currentUserFallowers >= 2 && currentUserFallowers <= 99) {
      reward = poolData.rewardCategory[0];
    } else if (currentUserFallowers >= 100 && currentUserFallowers <= 299) {
      reward = poolData.rewardCategory[1];
    } else if (currentUserFallowers >= 300 && currentUserFallowers <= 499) {
      reward = poolData.rewardCategory[2];
    } else if (currentUserFallowers >= 500 && currentUserFallowers <= 999) {
      reward = poolData.rewardCategory[3];
    } else if (currentUserFallowers >= 1000 && currentUserFallowers <= 4999) {
      reward = poolData.rewardCategory[4];
    } else if (currentUserFallowers >= 5000 && currentUserFallowers <= 9999) {
      reward = poolData.rewardCategory[5];
    } else if (currentUserFallowers >= 10000) {
      reward = poolData.rewardCategory[6];
    }

    reward = reward * 1000000000;
    if (reward) {
      setreward(reward);
    }
    console.log(publicKey);
    if (!publicKey) {
      toast.error("PublicKey not found");
      return;
    }
    const mintAddress = NATIVE_MINT;
    const clientAddress = new PublicKey(projectDetail?.invoiceCreaterPublicKey);

    const id = parseInt(Math.random() * 250);
    const id2 = parseInt(Math.random() * 250);
    const tweetId = data?.tweetId;
    if (publicKey) {
      let seed = `like-${tweetId}`;
      if (number === 1) {
        seed = `like-${tweetId}`;
      }
      if (number === 2) {
        seed = `retweet-${tweetId}`;
      }
      if (number === 3) {
        seed = `comment-${tweetId}`;
      }
      // let userForLikeAddress = anchor.web3.Keypair.generate();
      const userForLikeAddress = await PublicKey.createWithSeed(
        clientAddress,
        seed,
        program.programId
      );
      console.log(userForLikeAddress.toString(), "usersforlike");
      const [tweetAta, bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("tweets"),
          // provider.wallet.publicKey.toBuffer(),
          Buffer.from(tweetId),
          Buffer.from(projectName),
        ],
        program.programId
      );

      const [poolAddress] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("pool"),
          clientAddress.toBuffer(),
          mintAddress.toBuffer(),
          Buffer.from(projectName),
        ],
        program.programId
      );

      const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("poolAta"),
          clientAddress.toBuffer(),
          mintAddress.toBuffer(),
          Buffer.from(projectName),
        ],
        program.programId
      );

      const [globalAuth, globalBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [Buffer.from("global-authority")],
          // new anchor.BN(id).toArrayLike(Buffer)],
          program.programId
        );
      const prizeTokenAccount = await solConnection.getTokenAccountsByOwner(
        provider.wallet.publicKey,
        { mint: mintAddress }
      );

      // console.log(prizeTokenAccount.value[0].pubkey.toString())

      let userAta = (
        await PublicKey.findProgramAddress(
          [
            provider.wallet.publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAddress.toBuffer(), // mint address
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )[0];

      console.log(userAta.toString(), "associatedTokenAccountPubkey");
      console.log(tweetAta.toString(), bump, "tweetAta");
      console.log(poolAddress.toString(), "poolAddress");
      console.log(poolAta.toString(), "poolAta");
      console.log(
        await solConnection.getMinimumBalanceForRentExemption(336),
        "lamports"
      );

      // let instructions = [SystemProgram.createAccountWithSeed(
      //   {
      //     fromPubkey: provider.wallet.publicKey,
      //     basePubkey: provider.wallet.publicKey,
      //     seed: tweetValue,
      //     newAccountPubkey: userForLikeAddress,
      //     lamports: await solConnection.getMinimumBalanceForRentExemption(336),
      //     space: 336,
      //     programId: program.programId,
      //   }
      // )]
      const userAtaCheck = await solConnection.getTokenAccountsByOwner(
        provider.wallet.publicKey,
        { mint: mintAddress }
      );
      let instructions = [];
      if (userAtaCheck.value.length === 0) {
        console.log("2nd condition");
        instructions.push(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mintAddress,
            userAta,
            provider.wallet.publicKey,
            provider.wallet.publicKey
          )
        );
      }

      if (number === 1) {
        const tx = await program.rpc.likeTweet(
          globalBump,
          projectName,
          tweetId,
          new anchor.BN(reward),
          {
            accounts: {
              user: provider.wallet.publicKey,
              client: clientAddress,
              // tweetData: tweetAta,
              globalAuthority: globalAuth,
              // pool: poolAddress,
              usersForLike: userForLikeAddress,
              poolAta: poolAta,
              userAta: userAta,
              poolMint: mintAddress,
              // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
              // systemProgram: SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
              // rent: SYSVAR_RENT_PUBKEY,
            },
            instructions,
          }
        );
        console.log(tx, "tx");
        return tx;
      }
      if (number === 2) {
        const tx = await program.rpc.retweet(
          globalBump,
          projectName,
          tweetId,
          new anchor.BN(reward),
          {
            accounts: {
              user: provider.wallet.publicKey,
              client: clientAddress,
              // tweetData: tweetAta,
              globalAuthority: globalAuth,
              // pool: poolAddress,
              usersForRetweet: userForLikeAddress,
              poolAta: poolAta,
              userAta: userAta,
              poolMint: mintAddress,
              // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
              // systemProgram: SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
              // rent: SYSVAR_RENT_PUBKEY,
            },
            instructions,
          }
        );
        console.log(tx, "tx");
        return tx;
      }
      if (number === 3) {
        const tx = await program.rpc.commentTweet(
          globalBump,
          projectName,
          tweetId,
          new anchor.BN(reward),
          {
            accounts: {
              user: provider.wallet.publicKey,
              client: clientAddress,
              // tweetData: tweetAta,
              globalAuthority: globalAuth,
              // pool: poolAddress,
              usersForComment: userForLikeAddress,
              poolAta: poolAta,
              userAta: userAta,
              poolMint: mintAddress,
              // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
              // systemProgram: SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
              // rent: SYSVAR_RENT_PUBKEY,
            },
            instructions,
          }
        );
        console.log(tx, "tx");
        return tx;
      }
    } else {
      alert("connect wallet");
    }
  };

  const likeSpecificTweet = async () => {
    try {
      if (!data?.tweetId || !projectName) {
        toast.error("Tweet id or project name not found");
        return;
      }
      let body = {
        userId: currentUser?.twitterId,
        accessToken: currentUser?.accessToken,
        accessTokenSecret: currentUser?.accessTokenSecret,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_SERVERURL}/tweet/likeSpecificTweet/${data?.tweetId}`,
        body
      );
      if (res?.data?.data) {
        let tx = await LikeTweet(1);
        let result = await solConnection.confirmTransaction(tx);

        const body = {
          likeStatus: {
            tweetId: data?.tweetId,
            projectName,
            time: moment().unix(),
          },
          twitterId: currentUser.twitterId,
        };
        const response = await axios.patch(
          `${process.env.REACT_APP_SERVERURL}/api/updateRaidRewardStatus`,
          body,
          {
            headers: {
              Authorization: `BEARER ${currentUser.token}`,
            },
          }
        );

        setIsTweetLike(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const replyToSpecificTweet = async (reply) => {
    try {
      let body = {
        tweetReply: reply,
        accessToken: currentUser?.accessToken,
        accessTokenSecret: currentUser?.accessTokenSecret,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_SERVERURL}/tweet/replyToTweetWithTweetId/${data?.tweetId}`,
        body
      );
      if (res?.data?.data) {
        let tx = await LikeTweet(3);
        let result = await solConnection.confirmTransaction(tx);

        const body = {
          replyStatus: {
            tweetId: data?.tweetId,
            projectName,
            time: moment().unix(),
          },
          twitterId: currentUser.twitterId,
        };
        const response = await axios.patch(
          `${process.env.REACT_APP_SERVERURL}/api/updateRaidRewardStatus`,
          body,
          {
            headers: {
              Authorization: `BEARER ${currentUser.token}`,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const retweetATweet = async () => {
    try {
      let body = {
        userId: currentUser?.twitterId,
        accessToken: currentUser?.accessToken,
        accessTokenSecret: currentUser?.accessTokenSecret,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_SERVERURL}/tweet/retweetATweet/${data?.tweetId}`,
        body
      );
      if (res?.data?.data) {
        let tx = await LikeTweet(2);
        let result = await solConnection.confirmTransaction(tx);

        const body = {
          retweetStatus: {
            tweetId: data?.tweetId,
            projectName,
            time: moment().unix(),
            rewardAmount: rewards,
          },
          twitterId: currentUser?.twitterId,
        };
        const response = await axios.patch(
          `${process.env.REACT_APP_SERVERURL}/api/updateRaidRewardStatus`,
          body,
          {
            headers: {
              Authorization: `BEARER ${currentUser.token}`,
            },
          }
        );
        setIsTweetRetweeted(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllReplyOfATweet = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVERURL}/tweet/getAllReplyForATweet/${data?.tweetId}`
      );
      console.log(res?.data, "reply");
      setAllReplyOfATweet(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (data?.tweetId) {
      getAllReplyOfATweet();
    }
  }, [data?.tweetId, updateReplyFlag]);

  // const checkIsUserQuoteTheTweet = async () => {
  //   let result = await checkQuoteTweets();
  //   if (result) {
  //     setQuoteTweets(result);
  //   } else {
  //     // alert("no one Quote your tweet");
  //     return;
  //   }
  // };

  useEffect(() => {
    let isUserExist = false;
    if (quoteTweets) {
      retweetStatus?.map((status) => {
        if (status?.username === currentUser.userName) {
          alert("you have quote the tweet");
          isUserExist = true;
        }
      });
      if (!isUserExist) {
        alert("you have not quote the tweet");
      }
    }
  }, [quoteTweets]);

  return (
    <>
      {/* <Grid container spacing={2}> */}
      <Grid item xs={12} md={6} lg={4} sx={{ position: "relative" }}>
        <div className="penta gon ">
          <Card
            sx={{
              width: "100%",
              color: "white",
              background: "#333333",
              minHeight: "570px",
            }}
          >
            {/* <CardHeader
                className="card_header"
                sx={{ marginLeft: "50px", marginTop: "30px", color: "white" }}
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    R
                  </Avatar>
                }
                title={projectName}
                subheader={projectDetail?.projectTwitterUsername}
              /> */}

            <Typography
              variant="body2"
              color="white"
              sx={{
                textAlign: "center",
                background: "#545454",
                margin: "20px",
                borderRadius: "10px",
                padding: "10px 0px 0 0px",
                marginTop: "90px",
              }}
            >
              <Typography sx={{ display: "", justifyContent: "center" }}>
                <Typography
                  className="magic_eden"
                  variant="h7"
                  sx={{ fontSize: "19.4351px", justifyContent: "end" }}
                >
                  {projectName}
                </Typography>
                <br />
                <Typography
                  className="magic_eden"
                  variant="h7"
                  sx={{ fontSize: "18px", justifyContent: "end" }}
                >
                  {projectDetail?.projectTwitterUsername}
                </Typography>
              </Typography>
              <Typography
                className="magic_eden_desc"
                sx={{ fontSize: "13.6045px", padding: "10px" }}
              >
                {data?.tweetText}
              </Typography>

              <CardActions
                sx={{
                  justifyContent: "space-between",
                  background: "#636363",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
                disableSpacing
              >
                {!isTweetLike ? (
                  <IconButton
                    onClick={likeSpecificTweet}
                    aria-label="add to favorites"
                  >
                    <Icon color="white" icon="ant-design:heart-filled" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => alert("You have already like the tweet")}
                    aria-label="add to favorites"
                  >
                    <Icon
                      color="rgb(249, 24, 128)"
                      icon="ant-design:heart-filled"
                    />
                  </IconButton>
                )}
                {!isTweetRetweeted ? (
                  <IconButton onClick={retweetATweet} aria-label="share">
                    <Icon color="white" icon="ant-design:retweet-outlined" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => alert("You have already retweet the tweet")}
                    aria-label="share"
                  >
                    <Icon
                      color="rgb(0, 186, 124)"
                      icon="ant-design:retweet-outlined"
                    />
                  </IconButton>
                )}
                <IconButton aria-label="share">
                  <Icon
                    color="white"
                    onClick={() => setOpenModal(true)}
                    icon="fa-regular:comment-dots"
                  />
                </IconButton>
                <IconButton aria-label="share">
                  <Icon color="white" icon="ci:share" />
                </IconButton>
              </CardActions>
            </Typography>

            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    borderBottom: "1px solid gray",
                    padding: "unset !important",
                  }}
                  disableSpacing
                >
                  <IconButton
                    className="iconBtn"
                    sx={{
                      fontSize: "13px",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    aria-label="add to favorites"
                  >
                    <Icon icon="bi:clock-history" /> Date
                  </IconButton>

                  <IconButton
                    className="iconBtn"
                    sx={{ fontSize: "12px", gap: "5px" }}
                    aria-label="share"
                  >
                    <Typography className="active_icon"></Typography>

                    {poolData?.startTime ? (
                      <>
                        Active ( {moment.unix(poolData?.startTime).fromNow()})
                      </>
                    ) : (
                      "Not Started yet"
                    )}
                  </IconButton>
                </CardActions>

                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    borderBottom: "1px solid gray",
                    padding: "unset !important",
                  }}
                  disableSpacing
                >
                  <IconButton
                    className="iconBtn"
                    sx={{
                      fontSize: "13px",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    aria-label="add to favorites"
                  >
                    <Icon icon="arcticons:rewards" /> Reward
                  </IconButton>

                  <IconButton
                    className="iconBtn"
                    sx={{ fontSize: "12px", gap: "5px" }}
                    aria-label="share"
                  >
                    0 (SOL)
                  </IconButton>
                </CardActions>

                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    borderBottom: "1px solid gray",
                    padding: "unset !important",
                  }}
                  disableSpacing
                >
                  <IconButton
                    className="iconBtn"
                    sx={{
                      fontSize: "13px",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    aria-label="add to favorites"
                  >
                    <Icon icon="bi:clock-history" /> Claimed Rewards
                  </IconButton>

                  <IconButton
                    className="iconBtn"
                    sx={{ fontSize: "12px", gap: "5px" }}
                    aria-label="share"
                  >
                    {tweetsStatus ? tweetsStatus : ""} (SOL)
                  </IconButton>
                </CardActions>

                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    borderBottom: "1px solid gray",
                    padding: "unset !important",
                  }}
                  disableSpacing
                >
                  <IconButton
                    className="iconBtn"
                    sx={{
                      fontSize: "13px",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    aria-label="add to favorites"
                  >
                    <Icon icon="charm:at-sign" /> Total Mentions
                  </IconButton>

                  <IconButton
                    className="iconBtn"
                    sx={{ fontSize: "12px", gap: "5px" }}
                    aria-label="share"
                  >
                    155
                  </IconButton>
                </CardActions>
                {/* {currentUserr&&<UserMentions currentUser={currentUserr} data={dataa} />} */}

                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  {/* <Button
                    className="raid_btn"
                    sx={{ paddingLeft: "70px", paddingRight: "70px" }}
                    variant="contained"
                  >
                    Raid
                  </Button> */}
                </Typography>
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                justifyContent: "center",
                position: "absolute",
                bottom: "6%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              disableSpacing
            >
              <IconButton aria-label="add to favorites">
                <Icon color="white" icon="akar-icons:twitter-fill" />
              </IconButton>
              <IconButton aria-label="share">
                <Icon color="white" icon="akar-icons:discord-fill" />
              </IconButton>
            </CardActions>
          </Card>
        </div>

        <div className="triangle" style={{ background: "#FFA34E" }}>
          <img className="mail_logo" src="r.png" alt="" />
        </div>
      </Grid>
      {/* </Grid> */}

      <ThreadModal
        allReplyOfATweet={allReplyOfATweet}
        data={data}
        openModal={openModal ? openModal : false}
        handleModal={handleModal}
        handleReplyData={handleReplyData}
      />
    </>
  );
};
export default Tweet;
