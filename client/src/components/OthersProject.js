import React, { useState } from "react";
import { connect } from "react-redux";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Grid from "@mui/material/Grid";
import { Icon } from "@iconify/react";
import Button from "@mui/material/Button";
import TweetsCard from "./tweetsCard";
import Tweets from "./Tweets";
import Pool from "./Pool";
import MentionProjects from "./MentionProjects";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const OtherProjects = (props, {
  
  userNotIncludeProjectsForMention,
  userNotIncludeProjectsForRaid,
  currentUser, pool, projectDetail,
  // props, data
}) => {
  console.log(props, "lopipo")
  const { projectName } = useParams();
  const [getAllInvoices, setGetAllInvoices] = useState();


  useEffect(() => {
    getAllTweets()
  }, [])

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
  console.log( userNotIncludeProjectsForMention, "userNotIncludeProjectsForRaid");
  
  return (
    <>
         {getAllInvoices?.map((data) => (
                    <>                   
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
                            
                            </>))}
             {getAllInvoices?.map((data) => {
                if(!data?.isRaid)
            return <MentionProjects mention={true} datas={data} currentUsers={props?.auth}/>
             })}
   
    </>
  );
};
function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(OtherProjects);
