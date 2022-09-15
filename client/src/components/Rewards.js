import React from "react";
import { Icon } from "@iconify/react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import { red } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import UserMentions from "./UserMentions";
import RewardCards from "./RewardCrads";

import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";

const array = [1, 2, 3, 4, 5, 6];
const Rewards = () => {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box
        className="tabs_container"
        sx={{
          width: "95%",
          margin: "0 auto",
          typography: "body1",
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "#00ACEE" }}>
            <TabList
              sx={{ gap: "5px" }}
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              <Tab
                className="dashboard_tabs"
                sx={{ color: "white" }}
                label="LIVE"
                value="1"
              />
              <Tab
                className="dashboard_tabs"
                sx={{ color: "white" }}
                label="CLOSED"
                value="2"
              />
            </TabList>
          </Box>

          <TabPanel
            sx={{
              color: "white",
              padding: "0 !important",
              marginTop: "30px",
            }}
            value="1"
          >
            <Grid container spacing={2}>
              {array.map((item) => {
                return (
                  <>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      sx={{ position: "relative" }}
                    >
                      <div className="penta gon ">
                        <Card
                          sx={{
                            width: "100%",
                            color: "white",
                            background: "#333333",
                            minHeight: "570px",
                          }}
                        >
                          <CardHeader
                            className="card_header"
                            sx={{
                              marginLeft: "50px",
                              marginTop: "30px",
                              color: "white",
                            }}
                            avatar={
                              <Avatar
                                sx={{ bgcolor: red[500] }}
                                aria-label="recipe"
                              >
                                R
                              </Avatar>
                            }
                            title="projectName"
                            subheader="projectTwitterUsername"
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
                              // marginTop: "90px",
                            }}
                          >
                            <Typography
                              sx={{ display: "", justifyContent: "center" }}
                            >
                              <Typography
                                className="magic_eden"
                                variant="h7"
                                sx={{
                                  fontSize: "19.4351px",
                                  justifyContent: "end",
                                }}
                              >
                                project name
                              </Typography>
                              <br />
                              <Typography
                                className="magic_eden"
                                variant="h7"
                                sx={{ fontSize: "18px", justifyContent: "end" }}
                              >
                                magic
                              </Typography>
                            </Typography>
                            <Typography
                              className="magic_eden_desc"
                              sx={{ fontSize: "13.6045px", padding: "10px" }}
                            >
                              magic edden
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
                              <IconButton aria-label="add to favorites" sx={{gap:"10px", fontSize:"20px"}}>
                                <Icon
                                  color="white"
                                  icon="ant-design:heart-filled"
                                />
                                <Typography variant="p" sx={{color:"white", fontSize:"16px"}}>127</Typography>
                              </IconButton>

                            

                              <IconButton aria-label="share" sx={{gap:"10px", fontSize:"20px"}}>
                                <Icon
                                  color="white"
                                  icon="ant-design:retweet-outlined"
                                  
                                />
                                <Typography variant="p" sx={{color:"white", fontSize:"16px"}}>97</Typography>

                              </IconButton>

                              

                              <IconButton aria-label="share" sx={{gap:"10px", fontSize:"20px"}}>
                                <Icon
                                sx={{fontSize:"12px"}}
                                  color="white"
                                  // onClick={() => setOpenModal(true)}
                                  icon="fa-regular:comment-dots"
                                />
                                 <Typography variant="p" sx={{color:"white", fontSize:"16px"}}>101</Typography>
                              </IconButton>
                              <IconButton aria-label="share" sx={{fontSize:"20px"}}>
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
                                  <Icon icon="bi:clock-history" /> Closed
                                </IconButton>

                                <IconButton
                                  className="iconBtn"
                                  sx={{ fontSize: "12px", gap: "5px" }}
                                  aria-label="share"
                                >
                                  <Typography className="active_icon2"></Typography>
                                  Ended at 2022-04-26)
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
                                  <Icon icon="arcticons:rewards" /> $FORGE Reward
                                </IconButton>

                                <IconButton
                                  className="iconBtn"
                                  sx={{ fontSize: "12px", gap: "5px" }}
                                  aria-label="share"
                                >
                                  1 $FORGE
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
                                  <Icon icon="bi:clock-history" /> Tweet Created At
                                </IconButton>

                                <IconButton
                                  className="iconBtn"
                                  sx={{ fontSize: "12px", gap: "5px" }}
                                  aria-label="share"
                                >
                                  Mon Apr 25 18:30:51
                                </IconButton>
                              </CardActions>

                             

                              
                            </Typography>
                          </CardContent>
                          <Typography sx={{display:"flex", justifyContent:"center"}}>
                          <Button variant="contained" className="winners_btn">View Winners</Button>
                          </Typography>
                        </Card>
                      </div>

                      <div
                        className="triangle"
                        style={{ background: "#5DCA37", color:"white" }}
                      >
                        <img className="mail_logo" src="reward.png" alt="" />
                      </div>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </TabPanel>
          <TabPanel
            sx={{
              color: "white",
              fontSize: "50px",
              textAlign: "center",
              marginTop: "70px",
            }}
            value="2"
          >
            COMING SOON...
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default Rewards;
