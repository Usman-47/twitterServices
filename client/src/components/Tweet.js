import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// -----table imports ---------
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Icon } from "@iconify/react";
// <<<<<<< HEAD
import ThreadModal from "./ThreadModal";

// =======
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
// import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
// import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid";
// import { Icon } from "@iconify/react";
// >>>>>>> 7db99f87208a75b0139e6c4325eca3ceaa372c93
// ====================

const Tweet = ({ currentUser, data, invoiceCreater, currentUsers, datas }) => {
  const [getTweetLikes, setGetTweetLikes] = useState();
  const [retweetStatus, setRetweetStatus] = useState();
  const [quoteTweets, setQuoteTweets] = useState();
  const [isTweetLike, setIsTweetLike] = useState();
  const [isTweetRetweeted, setIsTweetRetweeted] = useState();
  const [allReplyOfATweet, setAllReplyOfATweet] = useState();

  const { wallet, connect, sendTransaction, connecting, publicKey } =
    useWallet();

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

  // =======================
  // =======

  // >>>>>>> 7db99f87208a75b0139e6c4325eca3ceaa372c93
  const checkTweetLiked = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getTweetliked/${data?.tweetId}`
    );
    setGetTweetLikes(res.data.data);
  };

  useEffect(() => {
    if (getTweetLikes) {
      getTweetLikes.map((tweet) => {
        if (tweet?.username === currentUser.userName) {
          setIsTweetLike(true);
        } else {
          setIsTweetLike(false);
        }
      });
    }
  }, [getTweetLikes]);

  const checkTweetRetweet = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getRetweets/${data?.tweetId}`
    );
    setRetweetStatus(res?.data?.data);
  };

  useEffect(() => {
    if (retweetStatus) {
      retweetStatus?.map((status) => {
        if (status?.username === currentUser.userName) {
          setIsTweetRetweeted(true);
        } else {
          setIsTweetRetweeted(false);
        }
      });
    }
  }, [retweetStatus]);

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

  const likeSpecificTweet = async () => {
    try {
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
        setIsTweetLike(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const replyToSpecificTweet = async () => {
    try {
      let body = {
        tweetReply: "testing Reply",
        accessToken: currentUser?.accessToken,
        accessTokenSecret: currentUser?.accessTokenSecret,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_SERVERURL}/tweet/replyToTweetWithTweetId/${data?.tweetId}`,
        body
      );
      console.log(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(isTweetRetweeted, "isTweetRetweeted");
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
      setAllReplyOfATweet(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (data?.tweetId) {
      getAllReplyOfATweet();
    }
  }, [data?.tweetId]);

  const checkIsUserQuoteTheTweet = async () => {
    let result = await checkQuoteTweets();
    if (result) {
      setQuoteTweets(result);
    } else {
      // alert("no one Quote your tweet");
      return;
    }
  };

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
      <Grid item xs={12} md={6} lg={4} sx={{ position: "relative" }}>
        <div className="penta gon ">
          <Card sx={{ width: "100%", color: "white", background: "#333333" }}>
            <CardHeader
              className="card_header"
              sx={{ marginLeft: "50px", marginTop: "30px", color: "white" }}
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  R
                </Avatar>
              }
              // action={
              //   <IconButton aria-label="settings">
              //     <MoreVertIcon />
              //   </IconButton>
              // }
              title={datas?.projectName}
              subheader={datas?.projectTwitterUsername}
            />

            <Typography
              variant="body2"
              color="white"
              sx={{
                textAlign: "center",
                background: "#545454",
                margin: "20px",
                borderRadius: "10px",
                padding: "10px 0px 0 0px",
              }}
            >
              <Typography sx={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  className="magic_eden"
                  variant="h5"
                  sx={{ fontSize: "19.4351px", justifyContent: "end" }}
                >
                  Magic Eden
                </Typography>
              </Typography>
              <Typography
                className="magic_eden_desc"
                sx={{ fontSize: "13.6045px", padding: "10px" }}
              >
                This impressive paella is a perfect party dish and a fun meal to
                cook together with your guests. Add 1 cup of frozen peas along
                with the.
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
                <IconButton
                  onClick={likeSpecificTweet}
                  aria-label="add to favorites"
                >
                  <FavoriteIcon />
                </IconButton>
                <IconButton onClick={retweetATweet} aria-label="share">
                  <Icon icon="ant-design:retweet-outlined" />
                </IconButton>
                <IconButton aria-label="share">
                  <Icon icon="fa-regular:comment-dots" />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
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
                    <Typography className="active_icon"></Typography> Active
                    (Ends in 13h 28m 44s)
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
                    0.025 (SOL)
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
                    20 (SOL)
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
                  <Button
                    className="raid_btn"
                    sx={{ paddingLeft: "70px", paddingRight: "70px" }}
                    variant="contained"
                  >
                    Raid
                  </Button>
                </Typography>
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }} disableSpacing>
              <IconButton aria-label="add to favorites">
                <Icon icon="akar-icons:twitter-fill" />
              </IconButton>
              <IconButton aria-label="share">
                <Icon icon="akar-icons:discord-fill" />
              </IconButton>
            </CardActions>
          </Card>
        </div>

        <div className="triangle"></div>
      </Grid>

      {allReplyOfATweet && (
        <ThreadModal allReplyOfATweet={allReplyOfATweet} data={data} />
      )}
    </>
  );
};
export default Tweet;
