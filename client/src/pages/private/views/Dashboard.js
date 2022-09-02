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

  // if (!idVerified) {
  //   return (
  //     <>
  //       <div className="container h-100 w-100 p-5 d-flex justify-content-center m-5">
  //         <div className="row bg-warning p-5">
  //           <h1 className="col text-danger p-5">
  //             Please verify Your account , link sent in Your mail
  //           </h1>
  //           <WalletDisconnectButton/>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }
  if (publicKey && props.auth) {
    if (role !== USER) {
      return (
        <>
          <div className="container-fluid bg-black">
            <div className="row">
              {/* this is sidebar */}

              {role === ADMIN && showSideBar && (
                <AdminSidebar setShowSideBar={setShowSideBar} />
              )}
              {role === MANAGER && showSideBar && (
                <ManagerSidebar setShowSideBar={setShowSideBar} />
              )}

              {/* this is mainscreen */}

              <div
                className="col container-fluid border shadow"
                style={{ minHeight: "100vh" }}
              >
                <PublicNavBar
                  setShowSideBar={setShowSideBar}
                  showSideBar={showSideBar}
                />
                <div>
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          {/* <div className="container-fluid">
            <Tweets />
          </div> */}
          {navigate("/projects")}
        </>
      );
    }
  } else {
    return (
      <>
        <Home />
        {/* <WalletDisconnectButton/> */}
      </>
    );
  }
};
function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(Dashboard);
