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


const LandingHome = () => {
    const classes = useStyles();
    return (
        // <InteractiveList />
        // <RecipeReviewCard />
        <Grid
            container
            md={12}
            lg={12}
            // display={"flex"}
            className={classes.ConnectTwitterScreens}
        >

            <Grid item container md={12} sm={12} lg={12}>
                <Grid item md={6} sm={6} lg={6} className="left-grid">
                    <Typography
                        gutterBottom
                        className="welcome_heading"
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
                        className="welcome_text"
                        sx={{
                            fontSize: { xs: "10px", md: "15px", lg: "20px", xl: "40px" },
                        }}
                    >
                        Raid to Earn platform on the SOLANA Blockchain
                    </Typography>

                    <div className="landingHome-btns">
                        <div
                            style={{
                                marginRight: "20px",
                                textDecoration: "none",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        // to="/Signup"
                        >
                            <Button
                                className="raider_btn1"
                                variant="contained"
                                sx={{
                                    fontSize: { xs: "7px", md: "9px", lg: "11px", xl: "15px" },
                                }}

                            >
                                <span style={{ marginRight: "5px" }}>
                                    {/* <BsTwitter /> */}
                                </span>
                                I AM A RAIDER
                            </Button>
                        </div>


                        <div
                            style={{
                                textDecoration: "none",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        // to="/Signup"
                        >
                            <Button
                                className="raider_btn2"
                                variant="contained"
                                sx={{
                                    fontSize: { xs: "7px", md: "9px", lg: "11px", xl: "15px" },
                                }}

                            >
                                <span style={{ marginRight: "5px" }}>
                                    {/* <BsTwitter /> */}
                                </span>
                                I NEED RAIDER
                            </Button>
                        </div>
                    </div>
                </Grid>

                <Grid item md={6} sm={6} lg={6} className="right-grid">
                    <div className="landingHome-img">
                        <img src={`${Images.Frame1122}`} />
                    </div>
                </Grid>
            </Grid>
        </Grid >

    )
}


export default LandingHome;
