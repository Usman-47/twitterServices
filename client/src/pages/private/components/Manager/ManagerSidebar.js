import React from "react";

import SidebarTemplate from "../SidebarTemplate";
import ManagerNavElements from "./ManagerNavElements";

const ManagerSidebar = ({setShowSideBar}) => {
  return (
    <>
      <SidebarTemplate navArray={ManagerNavElements} setShowSideBar={setShowSideBar} />
    </>
  );
};

export default ManagerSidebar;
