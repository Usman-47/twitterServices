import React from "react";

import SidebarTemplate from "../SidebarTemplate";
import AdminNavArray from "./AdminNavElements";

const AdminSidebar = ({currentUser}) => {
  return (
    <>
      <SidebarTemplate navArray={AdminNavArray} currentUser={currentUser} />
    </>
  );
};

export default AdminSidebar;
