import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider, Grid } from "@mui/material";
import { minHeight } from "@mui/system";
export default function RewardCards() {
  const array = [
    { title: "Solana Wallet", src:"solana.png", btnText:"Select Solana Wallet" },
    { title: "Ethereum Wallet" , src:"ethereum.png", btnText:"Select Ethereum Wallet" },
    { title: "Twitter" , src:"twitter.png", btnText:"Connect Your Tweeter"},
  ];

  return (
    <>
      <Grid className="justify-content-xl-center" container sx={{width: "100%", marginBottom:"10px",}}>
        {array.map((item, i) => {
          return (
            <Grid item xs={11} md={5} lg={3.7} margin="10px">
              <Card className="rewards_card" sx={{ width:"100%", minHeight:"350px"}}>
                <Typography
                  sx={{
                    borderBottom: "1px solid gray",
                    margin: "0 40px 0 40px",
                    paddingBottom: "20px",
                  }}
                  component="div"
                >
                  {i === 0 && <img width={"100px"} src={item.src} alt="solana" /> }
                  {i === 1 && <img width={"55px"} src={item.src} alt="solana" /> }
                  {i === 2 && <img width={"125px"} src={item.src} alt="solana" /> }
                  <Typography gutterBottom variant="h5" marginTop="10px" color="white" component="div">
                    {item.title}
                  </Typography>
                </Typography>
                
                <CardContent>
                  
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button className="rewardCards_solana_btn" size="large">
                    {item.btnText}
                  </Button>
                  
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
