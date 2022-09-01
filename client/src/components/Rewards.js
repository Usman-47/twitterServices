import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { Icon } from '@iconify/react';
import CardContent from "@mui/material/CardContent";
import React from "react";
import RewardCards from "./RewardCrads";
const Rewards = () => {
  const array = [
    { title: "Note", src: "solana.png" },
    { title: "Membership Discounts", src: "ethereum.png" },
  ];
  return (
    <>
      <Typography sx={{background:"", width:"90%", margin:"0 auto"}} component="div">
        <RewardCards />

        <Grid container sx={{justifyContent:"center"}}>
          {array.map((item) => {
            return (
              <>
                <Grid item xs={11} md={5} lg={5.7}  margin="7px" >
                  <Card className="rewards_card2" sx={{ width: "100%",}}>
                    <Typography sx={{ margin: "0 30px 0 30px" }}>
                      <Typography
                        sx={{
                          borderBottom: "1px solid gray",

                          // paddingBottom: "20px",
                        }}
                        component="div"
                      >
                        <Typography
                          gutterBottom
                        //   variant="h7"
                          color="white"
                          component="div"
                          sx={{display:"flex", fontSize:"24px !important", alignItems:"center"}}
                        >
                         
                          <Icon icon="fe:warning" />
                          
                          {item.title}
                         
                        </Typography>
                      </Typography>
                      {/* <Divider/> */}
                      <CardContent>
                        <Typography color="white" variant="body2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.
                        </Typography>
                      </CardContent>
                    </Typography>
                  </Card>
                </Grid>
              </>
            );
          })}
        </Grid>

        <Grid item xs={11} md={5} lg={5.7}  margin="7px" >
                  <Card className="rewards_card2" sx={{ width: "100%",}}>
                    <Typography sx={{ margin: "0 30px 0 30px" }}>
                      <Typography
                        sx={{
                          borderBottom: "1px solid gray",

                          // paddingBottom: "20px",
                        }}
                        component="div"
                      >
                        <Typography
                          gutterBottom
                        //   variant="h7"
                          color="white"
                          component="div"
                          sx={{display:"flex", fontSize:"24px !important", alignItems:"center"}}
                        >
                         
                          <Icon icon="fe:warning" />
                          
                          {/* {item.title} */}
                         
                        </Typography>
                      </Typography>
                      {/* <Divider/> */}
                      <CardContent>
                        <Typography color="white" variant="body2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.
                        </Typography>
                      </CardContent>
                    </Typography>
                  </Card>
                </Grid>
      </Typography>
    </>
  );
};

export default Rewards;
