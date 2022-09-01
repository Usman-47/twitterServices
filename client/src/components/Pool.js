import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import Tweet from "./Tweet";

// ====================

const Pool = ({ currentUser, pool, invoiceCreater }) => {
  const { wallet, connect, sendTransaction, connecting, publicKey } =
    useWallet();

  // =======================

  // useEffect(() => {
  //   if (currentUser && publicKey) {
  //     let data = {
  //       twitterId: currentUser.twitterId,
  //       publicKey: publicKey.toString(),
  //     };
  //     axios
  //       .patch(
  //         `${process.env.REACT_APP_SERVERURL}/api/addUserWalletPublicKey`,
  //         data
  //       )
  //       .then((response) => console.log(response, "responseresponse"));
  //   }
  // }, [publicKey, currentUser]);

  if (publicKey && currentUser) {
    return (
      <>
        {pool?.tweets &&
          pool?.tweets.map((data) => (
            <Tweet
              data={data}
              currentUser={currentUser}
              invoiceCreater={invoiceCreater}
            />
          ))}
      </>
    );
  }
};
export default Pool;
