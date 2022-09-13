import React, { useState } from "react";

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
import Tweet from "./Tweet";
import Pool from "./Pool";
import MentionProjects from "./MentionProjects";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import UserMentions from "./UserMentions";
import TabPanel from "@mui/lab/TabPanel";

const OtherProjects = ({
  currentUser,
  userNotIncludeProjectsForMention,
  userNotIncludeProjectsForRaid,

  // props, data
}) => {
  console.log(userNotIncludeProjectsForRaid, "ff");

  return (
    <>
      {currentUser &&
        userNotIncludeProjectsForMention?.map((data) => (
          <>
            <MentionProjects
              currentUsers={currentUser}
              datas={data}
              mention={true}
            />
          </>
        ))}

      {currentUser &&
        userNotIncludeProjectsForRaid.map((data) => (
          <>
            <Tweet
              currentUser={currentUser}
              data={data.tweet}
              projectDetail={data.projectDetail}
            />
          </>
        ))}
    </>
  );
};
export default OtherProjects;
