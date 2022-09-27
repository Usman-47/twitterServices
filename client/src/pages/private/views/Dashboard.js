import * as React from "react";
import { useEffect } from "react";
import Home from "../../../components/Home";
import PublicNavBar from "../../../components/Navbar/PublicNavBar";

import { Outlet, useNavigate } from "react-router-dom";
import useUserFunc from "../../../hooks/useUserFunc";

import useDispatchFunc from "../../../hooks/useDispatchFunc";
import { toast } from "react-toastify";
import { connect } from "react-redux";

import { ADMIN, MANAGER, USER } from "../../../helpers/UserRoles";

import AdminSidebar from "../components/Admin/AdminSidebar";
import ManagerSidebar from "../components/Manager/ManagerSidebar";
import { useWallet } from "@solana/wallet-adapter-react";
const Dashboard = (props) => {
  const navigate = useNavigate();

  const [, getRole] = useUserFunc();
  const role = getRole();
  const [dispatch] = useDispatchFunc();

  // ================
  const { window } = props;
  const [showSideBar, setShowSideBar] = React.useState(true);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const { publicKey, connected } = useWallet();

  const [flag, setFlag] = React.useState(false);
  useEffect(() => {
    if (flag) {
      if (!connected || !props.auth) {
        dispatch({ type: "signout" });
      }
    }
    setFlag(true);
  }, [publicKey, props.auth]);

  // ================
  if (!role) {
    dispatch({ type: "signout" });
    navigate("/user/signin");
    toast.error("Role is not Recognised, signIn again");
  }

  if (publicKey && props.auth) {
    if (role !== USER) {
      return (
        <>
          <div className=" bg-black">
            <div className="row dashboard_main_row">
              {/* this is sidebar */}

              {role === ADMIN && showSideBar && (
                <AdminSidebar
                  setShowSideBar={setShowSideBar}
                  currentUser={props?.auth}
                />
              )}
              {role === MANAGER && showSideBar && (
                <ManagerSidebar
                  currentUser={props?.auth}
                  setShowSideBar={setShowSideBar}
                />
              )}

              <div className="col shadow" style={{ minHeight: "100vh" }}>
                <PublicNavBar
                  setShowSideBar={setShowSideBar}
                  showSideBar={showSideBar}
                />
                <div style={{ width: "90%", margin: "0 auto" }}>
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return <>{navigate("/projects")}</>;
    }
  } else {
    return (
      <>
        <Home />
      </>
    );
  }
};
function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(Dashboard);
