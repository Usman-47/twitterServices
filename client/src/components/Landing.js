import { Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import Images from "../assets/Images";
import { makeStyles } from "@mui/styles";
import { BsTwitter } from "react-icons/bs";
import RecipeReviewCard from "./RecipeReviewCard";
import AlignItemsList from "./InteractiveList";
import InteractiveList from "./InteractiveList";
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

const Landing = () => {
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
        <Grid item md={6} sm={6} lg={6}>
          <img src={`${Images.Asset2}?w=164&h=164&fit=crop&auto=format`} />
        </Grid>

        <Grid item md={6} sm={6} lg={6} className={classes.backs}>
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
          <Typography
            variant="p"
            gutterBottom
            className="reward_text"
            sx={{
              fontSize: { xs: "15px", md: "20px", lg: "30px", xl: "40px" },
            }}
          >
            CONNECT YOUR
            <Typography
              component="span"
              className=" reward_subtext"
              sx={{
                fontSize: { xs: "15px", md: "20px", lg: "30px", xl: "40px" },
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
            Link Natterbox with your twitter so we can know <br /> more about
            you.
          </Typography>
          <NavLink
            style={{
              textDecoration: "none",
              display: "flex",
              justifyContent: "center",
            }}
            to="/Signup"
          >
            <Button
              className="registeration"
              variant="contained"
              sx={{
                fontSize: { xs: "7px", md: "9px", lg: "11px", xl: "15px" },
              }}
            >
              <span style={{ marginRight: "5px" }}>
                <BsTwitter />
              </span>
              Connect Your Twitter
            </Button>
          </NavLink>
        </Grid>
      </Grid>
    </Grid>
   </>
  );
};

export default Landing;
