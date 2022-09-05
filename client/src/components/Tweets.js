import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
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
import Divider from "@mui/material/Divider";

// ======= tabs imports =======
// import Box from '@mui/material/Box';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import Typography from "@mui/material/Typography";
import ComboBox from "./All";
import OtherProjects from "./OtherProjects";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MenuIcon from '@mui/icons-material/Menu';
import UserDashboard from "./userDashoard";
import Profledescription from "./Profledescription";
import Setting from "./Setting";
import Progressbr from "./Progressbr";
import Cardsupport from "./Cardsupport";
import useDispatchFunc from "../hooks/useDispatchFunc";

const drawerWidth = 240;
const Tweets = (props) => {
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
          "Dashboard",
          "Mention to Earn",
          "Raid to Earn",
          "Sweep to Earn",
          "Rewards",
          "Stats",
          "Profile",
          "Setting",
          "Support",
        ].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              className="dashboard_list"
              onClick={() => setSelectedComponent(text)}
            >
              <ListItemIcon className="dasbboard_icons">
                {index === 0 ? (
                  <Icon icon="ic:twotone-space-dashboard" />
                ) : index === 1 ? (
                  <Icon icon="bx:at" />
                ) : index === 2 || index === 3 ? (
                  <Icon icon="la:retweet" />
                ) : index===4 ? <Icon icon="arcticons:rewards" /> : index===5 ? <Icon icon="gridicons:stats" /> : index===6 ? <Icon icon="bx:user" /> : index===7? <Icon icon="ant-design:setting-filled" />: <Icon icon="healthicons:exercise-walk-supported" />}
              </ListItemIcon>
              <ListItemText style={{ color: "white" }} primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    windoww !== undefined ? () => windoww().document.body : undefined;

  // ======================
  const [getTweetLikes, setGetTweetLikes] = useState();
  const [getAllInvoices, setGetAllInvoices] = useState();
  const [getClientMentions, setGetClientMentions] = useState();
  const [retweetStatus, setRetweetStatus] = useState();
  const [quoteTweets, setQuoteTweets] = useState();
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
          width: {background:"black", sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{marginLeft:"auto"}} component="div">
              <Typography  sx={{display:"flex", justifyContent:"end"}} component="div">
                <Typography onClick={handleClick}>
                  <Stack direction="row">
                    <Avatar
                      className="user_avatar"
                      alt="Cindy Baker"
                      
                      sx={{ width: 40, height: 40 }}
                    />
                  </Stack>
                </Typography>
                <Menu
                
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem>
                 
                      {[
                        <Button
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
                  <WalletDisconnectButton />
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
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
            <UserDashboard />
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
                                  width: "95%",
                                  margin: "0 auto",
                                  typography: "body1",
                                }}
                              >
                              

                                  <TabPanel sx={{ color: "white" }} value="2">
                                    Item One
                                  </TabPanel>
                                  
                                  <TabPanel
                                    sx={{
                                      color: "white",
                                      padding: "0 !important",
                                      marginTop: "40px",
                                    }}
                                    value="1"
                                  >
                                  
                                  </TabPanel>
                                  
                              </Box>
                        
                  </TabContext>
                </Box>
                <Grid container spacing={2}>
                        {getAllInvoices?.map((data) => (
                          <>
                        
                            {data?.isRaid === false ? (
                              <>
                            
                             
                                
                                  <OtherProjects
                                    currentUsers={props?.auth}
                                    datas={data}
                                  />
                             
                            
                                {/* <UserMentions currentUser={props?.auth} data={data} /> */}
                              </>
                            ) : null}
                          
                          </>
                        ))}
                        </Grid>
                
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
                    <div
                      style={{
                        marginTop: 50,
                        padding: "30px",
                        // border: "2px solid #00ACEE",
                        // borderRadius: "20px",
                      }}
                    >
                     

                          <TabPanel sx={{ color: "white" }} value="2">
                            Item One
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
                              {data?.isRaid &&
                                data?.pool?.map((pool) => (
                                  <>
                                    <Pool
                                      currentUser={props?.auth}
                                      pool={pool}
                                      projectDetail={data}
                                    />
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
          ) : selectedComponent === "Rewards" ? <Rewards/>: selectedComponent === "Profile" ? (
            <Profledescription />
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
