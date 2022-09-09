import React from "react";
import { Grid, Button, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import {
  useWalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { NavLink } from "react-router-dom";

const PublicNavBar = ({ setShowSideBar, showSideBar, home }) => {
  return (
    <>
      <div
        className="bg-black pb-4 ps-2 pe-2"
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
              {(!home) ? <Icon style={{ fontSize: "30px" , color:"white"}} icon="dashicons:menu" />: null}
            </Typography>
            <Grid container >
              <Grid item xs={1}>
                <Icon className="wallet-icon text-white" icon="clarity:wallet-line" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item className="header_right">
           <div className="d-flex align-items-center gap-2">
             {/* <Grid container spacing={5} alignItems="center">
              <Grid item xs={1}> */}
              <Icon className="header-icon text-white" icon="radix-icons:discord-logo" />
              {/* </Grid>
              <Grid item xs={1}> */}
                <Icon className="header-icon text-white" icon="ant-design:user-outlined" />
              {/* </Grid> */}
              {/* <Grid item xs={3} lg={5}> */}
              <WalletMultiButton className="wallet-btn" />
                
              {/* </Grid> */}
            {/* </Grid> */}
           </div>
            
          </Grid>
        </Grid>
        
      </div>
    </>
  );
};

export default PublicNavBar;
