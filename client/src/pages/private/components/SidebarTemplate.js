import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PublicNavBar from "../../../components/Navbar/PublicNavBar";
import useStatesFunc from "../../../hooks/useStatesFunc";
import { Icon } from "@iconify/react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
const SidebarTemplate = ({ navArray, setShowSideBar }) => {
  const [{ sidebar }] = useStatesFunc();

  return (
    <>
      <div
        style={{
          position: "relative",
          top: "0",
          height: "100vh",
          zIndex: "999",
        }}
        className={
          sidebar
            ? "side_bar col-5 col-md-3 col-lg-2 border  bg-black text-white fixed"
            : "d-none"
        }
      >
        <div className="container" sx={{ position: "relative" }}>
          <Button
            className="d-md-none"
            sx={{ position: "absolute", right: "0", top: "10px" }}
            onClick={() => setShowSideBar(false)}
          >
            <Icon icon="fa6-solid:less-than" />
          </Button>

          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "40px",
              marginTop: "70px",
            }}
          >
            <img src="/natter.png" alt="" />
          </Typography>
          <nav className="overflow-hidden mt-5">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 py-4">
              {navArray &&
                navArray.map((navElement) => (
                  <li
                    className="nav-item py-2 sidebar-links"
                    key={navElement.href}
                    // onClick={() => setShowSideBar(false)}
                  >
                    <NavLink
                      sx={{ color: "white" }}
                      className={({ isActive }) =>
                        isActive
                          ? "nav-link active #0dcaf0 fw-bold"
                          : "nav-link text-white"
                      }
                      to={navElement.href}
                      key={navElement.id}
                    >
                      <Icon icon="ic:twotone-space-dashboard" />
                      {navElement.name}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </nav>

          <Typography
            // component={container}
            sx={{
             
              position:"absolute",
              bottom:"0",
              right:"0%"
             
            }}
          >
            <CardHeader
              sx={{ color: "white", }}
              avatar={
                <Avatar sx={{ backgroundColor: "#5865F2" }} aria-label="recipe">
                  <Icon icon="iconoir:discord" />
                </Avatar>
              }
              title="Jhon Wick"
              subheader="Membership Status: STANDARD"
            />
          </Typography>
        </div>
      </div>
    </>
  );
};

export default SidebarTemplate;
