import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";

const TopRaiders = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
    <Typography
                style={{
                  padding: "20px 20px 0 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" color="white">
                  Top Raiders
                </Typography>
                <Icon
                  color="white"
                  icon="teenyicons:adjust-horizontal-outline"
                />
              </Typography>
      {arr.map((item) => {
        return (
          <>
          
            <Typography>
              
              <CardHeader
                sx={{
                  // position: "absolute",
                  padding:"10px 10px 0 10px",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  color: "white",
                }}
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: red[500],
                    }}
                    aria-label="recipe"
                  >
                    R
                  </Avatar>
                }
                action={
                  <IconButton
                    aria-label="settings"
                    sx={{
                      color: "white",
                    }}
                  >
                    {/* <MoreVertIcon /> */}
                    <Typography
                      className="raids_card"
                      component="div"
                      sx={{
                        width: "67px",
                        fontSize: "17px",
                        height: "44px",
                        // background: "#00ACEE",
                        // borderRadius: "50px 0px 0px 50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      + 2SOL
                    </Typography>
                  </IconButton>
                }
                title="NFT Blaze"
                subheader="@huehewiuewjiw"
              />
            </Typography>
          </>
        );
      })}
    </>
  );
};

export default TopRaiders;
