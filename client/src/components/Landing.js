import { Button, Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import useUserFunc from "../hooks/useUserFunc";
import useDispatchFunc from "../hooks/useDispatchFunc";
import { connect } from "react-redux";
import Images from "../assets/Images";
import { makeStyles } from "@mui/styles";
import { BsTwitter } from "react-icons/bs";
const useStyles = makeStyles((theme) => ({
  MenuItem: {
    backgroundImage: `url(${Images.LandingPageimage})`,
    height: "100vh",
    backgroundSize: "100% 100%",
    paddingTop: "20px",
    backgroundRepeat: "no-repeat",
  },
  banner: {
    backgroundImage: `url(${Images.banner})`,
    height: "100vh",
    backgroundSize: "100% 100%",
    // paddingTop:"140px",

    backgroundRepeat: "no-repeat",
  },
  back: {
    backgroundImage: `url(${Images.twetback})`,
    // height: '100vh',
    // backgroundSize: "100% 100%",

    // backgroundRepeat: "no-repeat",
    // paddingTop: "60px",
    // paddingBottom: "60px",
    // paddingLeft: "20px",
    // paddingRight: "20px",
    color: "white",
  },
  picture: {
    position: "relative",
    backgroundImage: `url(${Images.picture})`,
    height: "55vh",
    backgroundSize: "100% 100%",

    backgroundRepeat: "no-repeat",
    paddingTop: "60px",
    paddingBottom: "60px",
    marginTop: "60px",
    marginBottom: "40px",

    color: "white",
  },
  ConnectTwitterScreens: {
    // position: "relative",
    backgroundImage: `url(${Images.ConnectTwitterScreens})`,
    minHeight: "100vh",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    // backgroundAttachment: "fixed",

    backgroundRepeat: "no-repeat",
    // paddingTop: "60px",
    // paddingBottom: "60px",
    // marginTop: "60px",
    // marginBottom: "40px",

    color: "white",
  },

  backs: {
    // height: '100vh',
    // width: "50%",
    // position: "absolute",
    // right: "5%",
    // top: "40%",
    // transform: "translateY( -40%)",
    // paddingTop: "60px",
    // paddingBottom: "60px",
    // paddingLeft: "20px",
    // paddingRight: "20px",
    color: "black",
    display: "flex-Block",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },

  FontFamilyGet: {
    fontFamily: "Raleway",
  },
  formbuton: {
    backgroundColor: "#00ACEE",
    color: "#FFFFFF",
    padding: "10px 20px",

    borderTopLeftRadius: "30px",
    borderBottomRightRadius: "30px",
  },
  formbutons: {
    backgroundColor: "#00ACEE",
    color: "#FFFFFF",
    padding: "10px 0px",
    marginLeft: "15px !important",

    borderTopLeftRadius: "30px",
    borderBottomRightRadius: "30px",
  },
  Paragraph: {
    fontSize: "20px",
  },
  secondcontainer: {
    marginTop: "50px",
  },

  gridcenter: {
    // background:"blue"

    backgroundImage: `url(${Images.banner})`,
    height: "90vh",
    // position: "absolute" ,
    // top: "50%",
    // left: "50%",
    // transform:" translate(-50%, -50%)",
  },
}));

const Landing = (props) => {
  const { wallet, connect, sendTransaction, connecting, publicKey } =
    useWallet();
  const [istrue, setIsTrue] = React.useState(1);

  const handleCheck = (value) => {
    if (value == 2) {
      setIsTrue(value);
    } else if (value == 3) {
      setIsTrue(value);
    } else if (value == 4) {
      setIsTrue(value);
    } else if (value == 5) {
      setIsTrue(value);
    } else if (value == 6) {
      setIsTrue(value);
    }
  };

  const classes = useStyles();
  return (
   <>
     {/* <InteractiveList /> */}
    {/* <RecipeReviewCard /> */}
    <Grid
      container
      md={12}
      lg={12}
      // display={"flex"}
      className={classes.ConnectTwitterScreens}
    >
      <Grid item container md={12} sm={12} lg={12}>
        <Grid item xs={12} md={7} sm={6} lg={7}>
          <div className="grid-img-div">
            <img className={istrue == 3 ? "grid-img2" : istrue == 4 ? "grid-img2" : istrue == 5 ? "grid-img3" : istrue == 6 ? "grid-img3" : "grid-img1"}
              src={`${Images.Asset2}?w=164&h=164&fit=crop&auto=format`} />
          </div>
        </Grid>

        <Grid id="right_box" item xs={12} md={5} sm={6} lg={5} className={`right_box ${classes.backs}`}>
      
            <Typography
              gutterBottom
              className="reward_heading"
              sx={{
                fontSize: { xs: "30px", md: "40px", lg: "60px", xl: "90px" },
              }}
            >
              NATTER
              <Typography
                component="span"
                className=" reward_subheading"
                sx={{
                  fontSize: { xs: "30px", md: "40px", lg: "60px", xl: "90px" },
                }}
              >
                BOX
              </Typography>
            </Typography>
            {istrue == 1 ? (
              <>
                <Typography
                  variant="p"
                  gutterBottom
                  className="twitter_connect1"
                  sx={{
                    fontSize: {
                      xs: "15px",
                      md: "20px",
                      lg: "30px",
                      xl: "40px",
                    },
                  }}
                >
                  CONNECT YOUR
                  <Typography
                    component="span"
                    className=" twitter_connect2"
                    sx={{
                      marginLeft: { marginLeft: "6px" },
                      fontSize: {
                        xs: "15px",
                        md: "20px",
                        lg: "30px",
                        xl: "40px",
                      },
                    }}
                  >
                    TWITTER
                  </Typography>
                </Typography>
                <Typography
                  variant="body1"
                  id="reward_pro_para"
                  gutterBottom
                  className="reward_desc"
                  sx={{
                    fontSize: { xs: "7px", md: "9px", lg: "12px", xl: "17px" },
                  }}
                >
                  Link Natterbox with your twitter so we can know <br /> more
                  about you.
                </Typography>
              </>
            ) : null}

            {istrue == 1 ? (
              <>
                <div
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  // to="/Signup"
                >
                  <Button
                    className="registeration"
                    variant="contained"
                    sx={{
                      fontSize: {
                        xs: "7px",
                        md: "9px",
                        lg: "11px",
                        xl: "15px",
                      },
                    }}
                    onClick={() => {
                      handleCheck(2);
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      <BsTwitter />
                    </span>
                    Connect Your Twitter
                  </Button>
                </div>
              </>
            ) : null}

            {istrue == 2 ? (
              <>
                <div className="T_connect_heading">
                  <Typography
                    component="span"
                    className=" step2-textHeading2-1"
                    sx={{
                      fontSize: {
                        xs: "30px",
                        md: "40px",
                        lg: "60px",
                        xl: "90px",
                      },
                    }}
                  >
                    TWITTER
                  </Typography>
                  <Typography
                    component="span"
                    className="step2-textHeading2-2"
                    sx={{
                      marginLeft: { marginLeft: "6px" },
                      fontSize: {
                        xs: "30px",
                        md: "40px",
                        lg: "60px",
                        xl: "90px",
                      },
                    }}
                  >
                    CONNECTED
                  </Typography>
                </div>

                <Typography
                  variant="body1"
                  id="reward_pro_para"
                  gutterBottom
                  className="reward_desc"
                  sx={{
                    fontSize: { xs: "7px", md: "9px", lg: "12px", xl: "17px" },
                  }}
                >
                  Link Natterbox with your twitter so we can know <br /> more
                  about you.
                </Typography>

                <div className="account_profile_img">
                  <img src={`${Images.Frame30}`} />
                </div>

                <Typography id="account_name" className="account_name">
                  id name
                </Typography>

                <Typography id="change_account" className="change_account">
                  Change Twitter Account
                </Typography>

                <div
                  style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  // to="/Signup"
                >
                  <Button
                    className="registeration"
                    variant="contained"
                    sx={{
                      fontSize: {
                        xs: "7px",
                        md: "9px",
                        lg: "11px",
                        xl: "15px",
                      },
                    }}
                    onClick={() => {
                      handleCheck(3);
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {/* <BsTwitter /> */}
                    </span>
                    Continue
                  </Button>
                </div>
              </>
            ) : null}

            {istrue == 3 ? (
              <>
                <Typography
                  // variant="p"
                  gutterBottom
                  className="twitter_connect1"
                  sx={{
                    fontSize: {
                      xs: "15px",
                      md: "20px",
                      lg: "30px",
                      xl: "40px",
                    },
                  }}
                >
                  CONNECT YOUR
                  <Typography
                    // component="span"
                    className=" twitter_connect2"
                    sx={{
                      marginLeft: { marginLeft: "6px" },
                      fontSize: {
                        xs: "15px",
                        md: "20px",
                        lg: "30px",
                        xl: "40px",
                      },
                    }}
                  >
                    Wallet
                  </Typography>
                </Typography>
                <Typography
                  variant="body1"
                  id="reward_pro_para"
                  gutterBottom
                  className="reward_desc"
                  sx={{
                    fontSize: { xs: "7px", md: "9px", lg: "12px", xl: "17px" },
                  }}
                >
                  Link your wallet to continue
                </Typography>

                <div
                  style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  // to="/Signup"
                >
                  <Button
                    className="registeration"
                    variant="contained"
                    sx={{
                      fontSize: {
                        xs: "7px",
                        md: "9px",
                        lg: "11px",
                        xl: "15px",
                      },
                    }}
                    onClick={() => {
                      handleCheck(4);
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {/* <BsTwitter /> */}
                    </span>
                    Connect Wallet
                  </Button>
                </div>
              </>
            ) : null}

            {istrue == 4 ? (
              <>
                <Typography
                  // variant="p"
                  gutterBottom
                  className="twitter_connect1"
                  sx={{
                    fontSize: {
                      xs: "15px",
                      md: "20px",
                      lg: "30px",
                      xl: "40px",
                    },
                  }}
                >
                  CONNECT YOUR
                  <Typography
                    // component="span"
                    className=" twitter_connect2"
                    sx={{
                      marginLeft: { marginLeft: "6px" },
                      fontSize: {
                        xs: "15px",
                        md: "20px",
                        lg: "30px",
                        xl: "40px",
                      },
                    }}
                  >
                    Wallet
                  </Typography>
                </Typography>
                <Typography
                  variant="body1"
                  id="reward_pro_para"
                  gutterBottom
                  className="reward_desc"
                  sx={{
                    fontSize: { xs: "7px", md: "9px", lg: "12px", xl: "17px" },
                  }}
                >
                  Link your wallet to continue
                </Typography>

                <div
                  style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  // to="/Signup"
                >
                  <Button
                    className="wallet_info"
                    variant="contained"
                    sx={{
                      backgroundColor: { backgroundColor: "black" },
                      fontSize: {
                        xs: "7px",
                        md: "9px",
                        lg: "11px",
                        xl: "15px",
                      },
                    }}
                    // onClick={() => { handleCheck(4) }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {/* <BsTwitter /> */}
                    </span>
                    Wallet num
                  </Button>
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  // to="/Signup"
                >
                  <Button
                    className="registeration"
                    variant="contained"
                    sx={{
                      fontSize: {
                        xs: "7px",
                        md: "9px",
                        lg: "11px",
                        xl: "15px",
                      },
                    }}
                    onClick={() => {
                      handleCheck(5);
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {/* <BsTwitter /> */}
                    </span>
                    Continue
                  </Button>
                </div>
              </>
            ) : null}

            {istrue == 5 ? (
              <>
                <Typography
                  // variant="p"
                  gutterBottom
                  className="nft_verification1"
                  sx={{
                    fontSize: {
                      xs: "15px",
                      md: "20px",
                      lg: "30px",
                      xl: "40px",
                    },
                  }}
                >
                  NFTs
                  <Typography
                    // component="span"
                    className="nft_verification2"
                    sx={{
                      marginLeft: { marginLeft: "6px" },
                      fontSize: {
                        xs: "15px",
                        md: "20px",
                        lg: "30px",
                        xl: "40px",
                      },
                    }}
                  >
                    Verification
                  </Typography>
                </Typography>
                <Typography
                  variant="body1"
                  id="reward_pro_para"
                  gutterBottom
                  className="nft_verification_text"
                  sx={{
                    fontSize: { xs: "7px", md: "9px", lg: "12px", xl: "17px" },
                  }}
                >
                  You need to hold at least 1 Anubis Punt to gain Access.
                </Typography>

                <div className="account_profile_img">
                  <img src={`${Images.loadingBuffer}`} />
                </div>

                <Typography
                  variant="body1"
                  id="reward_pro_para"
                  gutterBottom
                  className="nft_verification_text"
                  sx={{
                    fontSize: { xs: "7px", md: "9px", lg: "12px", xl: "17px" },
                  }}
                >
                  If the loading takes too much time
                </Typography>

                <Typography
                  variant="body1"
                  id="reward_pro_para"
                  gutterBottom
                  className="nft_verification_text"
                  sx={{
                    color: { color: "red !important" },
                    fontSize: { xs: "7px", md: "9px", lg: "12px", xl: "17px" },
                  }}
                >
                  This means you do not have NFTs
                </Typography>

                {/* Dummy Button for testing */}
                <div
                  style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  // to="/Signup"
                >
                  <Button
                    className="registeration"
                    variant="contained"
                    sx={{
                      fontSize: {
                        xs: "7px",
                        md: "9px",
                        lg: "11px",
                        xl: "15px",
                      },
                    }}
                    onClick={() => {
                      handleCheck(6);
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {/* <BsTwitter /> */}
                    </span>
                    Go to NFTs
                  </Button>
                </div>
              </>
            ) : null}

            {istrue == 6 ? (
              <>
                <Typography
                  // variant="p"
                  gutterBottom
                  className="nft_verification1"
                  sx={{
                    fontSize: {
                      xs: "15px",
                      md: "20px",
                      lg: "30px",
                      xl: "40px",
                    },
                  }}
                >
                  NFTs
                  <Typography
                    // component="span"
                    className="nft_verification2"
                    sx={{
                      marginLeft: { marginLeft: "6px" },
                      fontSize: {
                        xs: "15px",
                        md: "20px",
                        lg: "30px",
                        xl: "40px",
                      },
                    }}
                  >
                    Verification
                  </Typography>
                </Typography>
                <Typography
                  variant="body1"
                  id="reward_pro_para"
                  gutterBottom
                  className="nft_verification_text"
                  sx={{
                    fontSize: { xs: "7px", md: "9px", lg: "12px", xl: "17px" },
                  }}
                >
                  You need to hold at least 1 Anubis Punt to gain Access.
                </Typography>

                <div className="account_nfts_div">
                  <div className="account_nfts_imgs">
                    <img src={`${Images.dummyNft1}`} />
                    <img src={`${Images.dummyNft2}`} />
                    <img src={`${Images.dummyNft3}`} />
                    <img src={`${Images.dummyNft4}`} />
                  </div>
                </div>

                <Typography
                  // variant="p"
                  gutterBottom
                  className="account_name1"
                  sx={{
                    fontSize: {
                      xs: "15px",
                      md: "20px",
                      lg: "30px",
                      xl: "40px",
                    },
                  }}
                >
                  Holy
                  <Typography
                    component="span"
                    className="account_name2"
                    sx={{
                      marginLeft: { marginLeft: "6px" },
                      fontSize: {
                        xs: "15px",
                        md: "20px",
                        lg: "30px",
                        xl: "40px",
                      },
                    }}
                  >
                    Angels
                  </Typography>
                </Typography>

                <div
                  style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  // to="/Signup"
                >
                  <Button
                    className="registeration"
                    variant="contained"
                    sx={{
                      fontSize: {
                        xs: "7px",
                        md: "9px",
                        lg: "11px",
                        xl: "15px",
                      },
                    }}
                    // onClick={() => { handleCheck(6) }}
                  >
                    Confirm
                    <span style={{ marginLeft: "5px" }}>
                      <img src={`${Images.confirmVector}`} />
                    </span>
                  </Button>
                </div>
              </>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(Landing);
