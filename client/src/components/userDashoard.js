import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import ComboBox from "./All";
import OthersProject from "./OthersProject";
import { Button } from "@mui/material";
import ThreadModal from "./ThreadModal";

const UserDashboard = ({
  userProjectsForMention,
  userProjectsForRaid,
  userNotIncludeProjectsForRaid,
  userNotIncludeProjectsForMention,
}) => {
  const [value, setValue] = React.useState("2");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        className="tabs_container"
        sx={{ width: "95%", margin: "0 auto", typography: "body1" }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "#00ACEE" }}>
            <TabList
              sx={{ gap: "5px" }}
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              {/* <Tab
                className="dashboard_tabs"
                sx={{ color: "white" }}
                label="MY PROJECTS"
                value="1"
              /> */}
              <Tab
                className="dashboard_tabs"
                sx={{ color: "white" }}
                label="OTHER PROJECTS"
                value="2"
              />
              <Tab
                className="dashboard_tabs"
                sx={{ color: "white" }}
                label="PAST PROJECTS"
                value="3"
              />
            </TabList>
          </Box>

          <Typography
            className="search_div"
            component="div"
            sx={{ display: "flex", width: "50%", marginTop: "40px" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6} md={6} lg={6}>
                <input
                  className="form-control me-2 bg-black"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
              </Grid>
              <Grid item xs={6} md={6} lg={6}>
                <ComboBox />
              </Grid>
            </Grid>
          </Typography>

          <ThreadModal />
          <TabPanel
            sx={{ color: "white", padding: "0 !important", marginTop: "40px" }}
            value="2"
          >
            <Grid container spacing={2}>
              <OthersProject
                userNotIncludeProjectsForMention={
                  userNotIncludeProjectsForMention
                }
                userNotIncludeProjectsForRaid={userNotIncludeProjectsForRaid}
              />
            </Grid>
          </TabPanel>
          <TabPanel
            sx={{
              color: "white",
              fontSize: "50px",
              textAlign: "center",
              marginTop: "70px",
            }}
            value="3"
          >
            COMMING SOON...
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default UserDashboard;
