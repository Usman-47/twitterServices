import React, { Component } from "react";
import { FaTwitter } from "react-icons/fa";

class LoginPage extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="signin_twitter_div m-auto border border-1 border-info rounded-3 bg-light p-5 text-center">
          <div className="card-content center-align">
            <h4>Sign In</h4>
            <p>Use existing social network account to sign in</p>
            <a
              className="align-items-center bg-info text-white border-info btn"
              href={`${process.env.REACT_APP_SERVERURL}/auth/twitter`}
            >
              <FaTwitter /> Sign in with Twitter
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default LoginPage;
