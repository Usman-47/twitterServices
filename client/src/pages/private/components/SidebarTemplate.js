import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PublicNavBar from "../../../components/Navbar/PublicNavBar";
import useStatesFunc from "../../../hooks/useStatesFunc";
import { Icon } from "@iconify/react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
const SidebarTemplate = ({ navArray ,setShowSideBar}) => {
  const [{ sidebar }] = useStatesFunc();
 
  
  return (
    <>
      <div

      style={{position:"relative", top:"0", height:"100vh", zIndex:"999"}}
        className={sidebar ? "side_bar col-5 col-md-3 col-lg-2 border  bg-black text-white fixed": "d-none"}
      >
        <div className="container" sx={{position:"relative"}}>
    <Button sx={{position:"absolute", right:"0", top:"10px"}} onClick={()=>setShowSideBar(false)}><Icon icon="fa6-solid:less-than" /></Button>
          <nav  className="overflow-hidden mt-5">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 py-4">
              {navArray &&
                navArray.map((navElement) => (
                  <li
                    className="nav-item py-2 sidebar-links"
                    key={navElement.href}
                    onClick={()=>setShowSideBar(false)}
                  >
                    <NavLink
                    sx={{color:"white"}}
                      className={({ isActive }) =>
                        isActive
                          ? "nav-link active #0dcaf0 fw-bold"
                          : "nav-link text-white"
                      }
                      to={navElement.href}
                      key={navElement.id}
                    >
                      {navElement.name}
                      
                    </NavLink>
                    
                    
                    
                  </li>
                  
                ))}

            </ul>
            
          
            
          
          </nav>

          <Typography
                  // component={container}
                  sx={{
                    width:"60%",
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
            <Typography sx={{borderBottomRightRadius:"20px", borderTopLeftRadius:"20px"}} paragraph className=" community_plan border border-1 text-center border-info p-1 text-white">
                   Community Plans
            </Typography>

                   <Typography
                    style={{ color: "white" }}
                    paragraph
                    className="icon"
                  >
                    <Icon icon="arcticons:twitter" className="icons" />
                    <Icon icon="bxl:discord" className="icons" />
                    <Icon icon="fa-regular:sun" className="icons" />
                    <Icon icon="ri:global-line" className="icons" />
                  </Typography>

                  </Typography>

        
        </div>
      </div>
    </>
  );
};

export default SidebarTemplate;
