import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import useStatesFunc from "../hooks/useStatesFunc";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import {
  useWalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Link, useParams } from "react-router-dom";
import { web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import IDL from "./twitter_program.json";
import Pool from "./Pool";
import UserMentions from "./UserMentions";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import AppBar from "@mui/material/AppBar";
import ListItemText from "@mui/material/ListItemText";
import CssBaseline from "@mui/material/CssBaseline";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import { Grid, ListItemIcon } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
// ======= tabs imports =======
// import Box from '@mui/material/Box';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import Typography from "@mui/material/Typography";

import MentionProjects from "./MentionProjects";
import Account from "./Account";
import Rewards from "./Rewards";
// ====================

// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
// import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
// import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import MenuIcon from "@mui/icons-material/Menu";
import UserDashboard from "./userDashoard";
import Profledescription from "./Profledescription";
import Setting from "./Setting";
import Progressbr from "./Progressbr";
import Cardsupport from "./Cardsupport";
import useDispatchFunc from "../hooks/useDispatchFunc";

const drawerWidth = 240;
const Tweets = (props) => {
  const [{ token }] = useStatesFunc();

  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { projectName } = useParams();
  // ==============
  const { windoww } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = React.useState("Dashboard");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userProjectsForMention, setUserProjectsForMention] = React.useState();
  const [userProjectsForRaid, setUserProjectsForRaid] = React.useState();
  const [
    userNotIncludeProjectsForMention,
    setUserNotIncludeProjectsForMention,
  ] = React.useState();
  const [userNotIncludeProjectsForRaid, setUserNotIncludeProjectsForRaid] =
    React.useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Typography
        sx={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}
      >
        <img src="natter.png" alt="" />
      </Typography>
      {/* <Divider /> */}

      <List>
        {[
          { text: "Dashboard", icon: "ic:twotone-space-dashboard" },
          { text: "Mention to Earn", icon: "bx:at" },
          { text: "Raid to Earn", icon: "la:retweet" },
          { text: "Sweep to Earn", icon: "la:retweet" },
          { text: "Rewards", icon: "arcticons:rewards" },
          { text: "Account", icon: "gridicons:stats" },
          { text: "Stats", icon: "bx:user" },
          { text: "Profile", icon: "ant-design:setting-filled" },
          { text: "Setting", icon: "healthicons:exercise-walk-supported" },
          { text: "Support", icon: "ic:twotone-space-dashboard" },
        ].map((obj, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              // className="dashboard_list text-white"
              onClick={() => setSelectedComponent(obj.text)}
              className={` ${
                selectedComponent === obj.text
                  ? "text-info border-bottom border-2 border-info"
                  : "text-white"
              }`}
            >
              <ListItemIcon className="dasbboard_icons">
                <Icon
                  color={selectedComponent === obj.text && "#00acee"}
                  icon={obj.icon}
                />
              </ListItemIcon>
              <ListItemText primary={obj.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Typography
      // component={container}
      // sx={{
      //   position: "absolute",
      //   bottom: "0",
      //   right: "0%",
      // }}
      >
        <CardHeader
          sx={{ color: "white" }}
          avatar={
            <Avatar sx={{ backgroundColor: "white" }} aria-label="recipe">
              <Icon color="rgb(29, 155, 240)" icon="akar-icons:twitter-fill" />
            </Avatar>
          }
          title={props?.auth?.userName}
          subheader="Membership Status: STANDARD"
        />
      </Typography>
    </div>
  );

  const container =
    windoww !== undefined ? () => windoww().document.body : undefined;

  // ======================
  const [getAllInvoices, setGetAllInvoices] = useState();
  const [flag, setFlag] = useState(false);
  const { wallet, connect, sendTransaction, connecting, connected, publicKey } =
    useWallet();
  const [dispatch] = useDispatchFunc();

  useEffect(() => {
    if (flag) {
      if (!connected) {
        dispatch({ type: "signout" });
      }
    }
    setFlag(true);
  }, [publicKey]);

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
    "ED9vZAgiAEq3Gg2GDZoDfHvfgnZ9WsQyBi3ADWDJUapQ",
    provider
  );

  const getAllTweets = async () => {
    var res;
    if (!projectName) {
      res = await axios.get(
        `${process.env.REACT_APP_SERVERURL}/api/public/allInvoices`
      );
    } else {
      res = await axios.get(
        `${process.env.REACT_APP_SERVERURL}/api/public/invoicePoolWithProjectName/${projectName}`
      );
    }
    if (res?.data?.invoicesFound) {
      setGetAllInvoices(res?.data?.invoicesFound);
    } else {
      alert("No Tweet Found");
    }
  };

  useEffect(() => {
    getAllTweets();
  }, []);

  useEffect(() => {
    var mentionProjectTempArray = [];
    var raidProjectTempArray = [];
    var notIncludeMentionProjectTempArray = [];
    var notIncludeRaidProjectTempArray = [];
    if (props.auth && getAllInvoices) {
      getAllInvoices.map((invoice) => {
        if (!invoice.isRaid) {
          let isUserMention = props?.auth?.rewardStatus.some(
            (item) => item.projectName === invoice.projectName
          );
          if (isUserMention) {
            props?.auth?.rewardStatus?.map((status) => {
              if (status.projectName === invoice.projectName) {
                let isTweetCreated = mentionProjectTempArray.some(
                  (item) => item.projectName === status.projectName
                );
                if (!isTweetCreated) {
                  mentionProjectTempArray.push(invoice);
                }
              }
            });
          } else {
            let isTweetCreated = notIncludeMentionProjectTempArray.some(
              (item) => item.projectName === invoice.projectName
            );
            if (!isTweetCreated) {
              notIncludeMentionProjectTempArray.push(invoice);
            }
          }
        } else {
          invoice?.pool?.map((data) => {
            var projectDetail = {
              projectName: invoice.projectName,
              projectTwitterUsername: invoice.projectTwitterUsername,
              invoiceCreaterPublicKey: invoice.invoiceCreaterPublicKey,
            };
            var pool = {
              startTime: data.startTime,
              endTime: data.endTime,
              rewardCategory: data?.category,
            };

            data?.tweets?.map((tweet) => {
              let isRetweeted = props?.auth?.raidStatus?.retweetStatus.some(
                (item) => item.tweetId === tweet.tweetId
              );
              if (isRetweeted) {
                props?.auth?.raidStatus?.retweetStatus?.map((retweet) => {
                  if (tweet.tweetId === retweet.tweetId) {
                    let isTweetCreated = raidProjectTempArray.some(
                      (item) => item.tweet.tweetId === retweet.tweetId
                    );
                    if (!isTweetCreated) {
                      raidProjectTempArray.push({ tweet, projectDetail, pool });
                    }
                  }
                });
              }
              let isLiked = props?.auth?.raidStatus?.likeStatus.some(
                (item) => item.tweetId === tweet.tweetId
              );
              if (isLiked) {
                props?.auth?.raidStatus?.likeStatus?.map((like) => {
                  if (tweet.tweetId === like.tweetId) {
                    let isTweetCreated = raidProjectTempArray.some(
                      (item) => item.tweet.tweetId === like.tweetId
                    );
                    if (!isTweetCreated) {
                      raidProjectTempArray.push({ tweet, projectDetail, pool });
                    }
                  }
                });
              }
              let isReply = props?.auth?.raidStatus?.likeStatus.some(
                (item) => item.tweetId === tweet.tweetId
              );
              if (isReply) {
                props?.auth?.raidStatus?.replyStatus?.map((reply) => {
                  if (tweet.tweetId === reply.tweetId) {
                    let isTweetCreated = raidProjectTempArray.some(
                      (item) => item.tweet.tweetId === reply.tweetId
                    );
                    if (!isTweetCreated) {
                      raidProjectTempArray.push({ tweet, projectDetail, pool });
                    }
                  }
                });
              }
              if (!isRetweeted && !isLiked && !isReply) {
                notIncludeRaidProjectTempArray.push({
                  tweet,
                  projectDetail,
                  pool,
                });
              }
            });
          });
        }
      });
    }
    setUserProjectsForMention(mentionProjectTempArray);
    setUserProjectsForRaid(raidProjectTempArray);
    setUserNotIncludeProjectsForMention(notIncludeMentionProjectTempArray);
    setUserNotIncludeProjectsForRaid(notIncludeRaidProjectTempArray);
  }, [getAllInvoices, props.auth]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  return (
    <>
      <Box sx={{ display: "flex", background: "black", minHeight: "100vh" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            width: { background: "black", sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography sx={{ marginLeft: "auto" }} component="div">
              <Typography
                sx={{ display: "flex", justifyContent: "end" }}
                component="div"
              >
                <Typography onClick={handleClick}>
                  <Stack direction="row">
                    <Avatar
                      backgroundColor="red"
                      className="user_avatar"
                      alt="Cindy Baker"
                      sx={{ width: 40, height: 40 }}
                    />
                  </Stack>
                </Typography>
                <Menu
                  sx={{ justifyContent: "center" }}
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                  }}
                  transformOrigin={{
                    vertical: "top",
                  }}
                >
                  <Typography>
                    <CardHeader
                      sx={{ color: "black", justifyContent: "center" }}
                      avatar={
                        <Avatar
                          sx={{ backgroundColor: "rgb(29, 155, 240)" }}
                          aria-label="recipe"
                        >
                          <Icon icon="akar-icons:twitter-fill" />
                        </Avatar>
                      }
                      title={props.auth?.userName}
                    />
                  </Typography>
                  <MenuItem>
                    {[
                      <Button
                        className="unlink_btn"
                        style={{ color: "white", borderColor: "none" }}
                        variant="contained"
                      >
                        Unlink from twitter
                      </Button>,
                    ].map((text, index) => (
                      <ListItem key={text} disablePadding>
                        <ListItemButton
                          href={`${process.env.REACT_APP_SERVERURL}/api/logout`}
                        >
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </MenuItem>
                  <div className="d-flex justify-content-center">
                    <WalletDisconnectButton className="wallet_disconnect" />
                  </div>
                </Menu>
              </Typography>
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                background: "#262626",
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                background: "#262626",
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          {selectedComponent === "Dashboard" ? (
            <UserDashboard
              currentUser={props?.auth}
              userProjectsForMention={userProjectsForMention}
              userProjectsForRaid={userProjectsForRaid}
              userNotIncludeProjectsForMention={
                userNotIncludeProjectsForMention
              }
              userNotIncludeProjectsForRaid={userNotIncludeProjectsForRaid}
            />
          ) : selectedComponent === "Mention to Earn" ? (
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

                  <Box
                    className="tabs_container"
                    sx={{
                      margin: "0 auto",
                      typography: "body1",
                    }}
                  >
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

                    <TabPanel
                      sx={{
                        color: "white",
                        padding: "0 !important",
                        marginTop: "40px",
                      }}
                      value="1"
                    >
                      <Grid container spacing={2}>
                        {getAllInvoices?.map((data) => (
                          <>
                            {data?.isRaid === false ? (
                              <>
                                {data?.pool?.length > 0 ? (
                                  <MentionProjects
                                    currentUsers={props?.auth}
                                    datas={data}
                                    mention={true}
                                  />
                                ) : null}
                                {/* <UserMentions currentUser={props?.auth} data={data} /> */}
                              </>
                            ) : null}
                          </>
                        ))}
                      </Grid>
                    </TabPanel>
                  </Box>
                </TabContext>
              </Box>
            </>
          ) : selectedComponent === "Raid to Earn" ? (
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
                  {getAllInvoices?.map((data) => (
                    <>
                      {data?.isRaid ? (
                        <div>
                          <TabPanel
                            sx={{
                              color: "white",
                              padding: "0 !important",
                              marginTop: "30px",
                            }}
                            value="1"
                          >
                            <Grid container spacing={2}>
                              {data?.isRaid &&
                                data?.pool?.map((pool) => (
                                  <>
                                    {pool?.endTime * 1000 > Date.now() ? (
                                      <Pool
                                        currentUser={props?.auth}
                                        pool={pool}
                                        projectDetail={data}
                                      />
                                    ) : null}
                                  </>
                                ))}
                            </Grid>
                          </TabPanel>

                          <TabPanel
                            sx={{
                              color: "white",
                              padding: "0 !important",
                              marginTop: "30px",
                            }}
                            value="2"
                          >
                            <Grid container spacing={2}>
                              {data?.isRaid &&
                                data?.pool?.map((pool) => (
                                  <>
                                    {pool?.endTime * 1000 < Date.now() ? (
                                      <Pool
                                        currentUser={props?.auth}
                                        pool={pool}
                                        projectDetail={data}
                                      />
                                    ) : null}
                                  </>
                                ))}
                            </Grid>
                          </TabPanel>
                        </div>
                      ) : null}
                    </>
                  ))}
                </TabContext>
              </Box>
            </>
          ) : selectedComponent === "Account" ? (
            <Account />
          ) : selectedComponent === "Rewards" ? (
            <Rewards />
          ) : selectedComponent === "Profile" ? (
            <Profledescription currentUser={props?.auth} />
          ) : selectedComponent === "Setting" ? (
            <Setting />
          ) : selectedComponent === "Stats" ? (
            <Progressbr />
          ) : (
            <Cardsupport />
          )}
        </Box>
      </Box>
    </>
  );
};
function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(Tweets);
