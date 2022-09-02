import React from "react";
import { Grid, Button, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import {
  useWalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { NavLink } from "react-router-dom";

const PublicNavBar = ({ setShowSideBar, showSideBar }) => {
  return (
    <>
      <div
        className="bg-black pb-4"
        style={{ marginBottom: "40px", marginTop: "20px" }}
      >
        <Grid
          container
          spacing={10}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid spacing={6} item className="header_left">
            <Typography
              className="menu_btn"
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <Icon style={{ fontSize: "30px" , color:"white"}} icon="dashicons:menu" />
            </Typography>
            <Grid container sx={{ marginLeft: "70px" }}>
              <Grid item xs={1}>
                <Icon className="wallet-icon text-white" icon="clarity:wallet-line" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item className="header_right">
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={1}>
                <Icon className="header-icon text-white" icon="radix-icons:discord-logo" />
              </Grid>
              <Grid item xs={1}>
                <Icon className="header-icon text-white" icon="ant-design:user-outlined" />
              </Grid>
              <Grid item xs={3}>
               
                <WalletMultiButton className="wallet-btn" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default PublicNavBar;
