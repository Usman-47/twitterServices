import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import useStatesFunc from "../../../../hooks/useStatesFunc";
import useDispatchFunc from "../../../../hooks/useDispatchFunc";

import AddInvoicePoolTweetApi from "../../../../apis/private/Invoice/AddInvoicePoolTweetApi";

import MiniSpinner from "../../../../helpers/MiniSpinner";
import Loader from "../../../../helpers/Loader";

import * as anchor from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  NATIVE_MINT,
} from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import IDL from "../../components/twitter_program.json";
import IDLFORRAID from "../../components/twitter_program_for_raid.json";

import NothingToShow from "../../Others/NothingToShow";
import { ADMIN, MANAGER } from "../../../../helpers/UserRoles";
import useUserFunc from "../../../../hooks/useUserFunc";
import { connect } from "react-redux";

const CreateInvoice = () => {
  const initialState = {
    tweetUrl: "",
  };
  const { publicKey } = useWallet();
  const { id } = useParams();
  const [stateValues, setStateValues] = useState(initialState);
  const [projectName, setProjectName] = useState();
  const [isRaid, setIsRaid] = useState(false);
  const [clientPublicKey, setClientPublicKey] = useState(false);

  const solConnection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "processed"
  );
  let cloneWindow = window;
  let provider = new anchor.Provider(
    solConnection,
    cloneWindow["solana"],
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(
    IDLFORRAID,
    "5UR1VYhWxH9iy5C7mdQWDztgDHLeGZoSyEjye4vzHcjs",
    provider
  );

  const [{ token, loading }] = useStatesFunc();
  const [dispatch] = useDispatchFunc();
  const navigate = useNavigate();
  const [, , checkUserAccess] = useUserFunc();

  const getProjectDetail = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/api/public/invoicePool/${id}`
    );
    console.log(res?.data, "hgjfddfd");
    if (res?.data?.invoiceFound[0]?.pool) {
      setIsRaid(res?.data?.invoiceFound[0]?.pool);
      setClientPublicKey(res?.data?.invoiceFound[0]?.invoiceCreaterPublicKey);
    } else {
      alert("No Tweet Found");
    }
  };

  useEffect(() => {
    if (id) {
      getProjectDetail();
    }
  }, [id]);
  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  if (!checkUserAccess([ADMIN, MANAGER])) {
    toast.warning("You cant access");
    return (
      <>
        <NothingToShow />
      </>
    );
  }
  const createTweet = async (tweetId) => {
    console.log(publicKey);
    // usman's account
    // const mintAddress = new PublicKey("J6K5HMGJ4MhaCngQE1HULHeN4mwAEQ1jQZN98mEY58nz")
    // const clientAddress = new PublicKey('3yhMnW4ge7oBZGqxLj2Fug3UvWTjx9cpaFd1rcymVEnx');

    // my accounts
    // const mintAddress = new PublicKey("3pCLx1uK3PVFGQ3siyxurvXXSLijth2prgBEK4cS33XF");
    const mintAddress = NATIVE_MINT;
    const clientAddress = new PublicKey(clientPublicKey);
    const id = parseInt(Math.random() * 250);
    const id2 = parseInt(Math.random() * 250);
    console.log(id, "id");
    console.log(id2, "id2");
    // const tweetId = "11dtsaar3441";
    if (publicKey) {
      // let userForLikeAddress = anchor.web3.Keypair.generate();
      const userForLikeAddress = await PublicKey.createWithSeed(
        provider.wallet.publicKey,
        `usersforlike-${tweetId}`,
        program.programId
      );
      console.log(userForLikeAddress.toString(), "usersforretweet");
      const userForRetweetAddress = await PublicKey.createWithSeed(
        provider.wallet.publicKey,
        `usersforretweet-${tweetId}`,
        program.programId
      );
      console.log(userForRetweetAddress.toString(), "usersforcomment");
      const userForCommentAddress = await PublicKey.createWithSeed(
        provider.wallet.publicKey,
        `usersforcomment-${tweetId}`,
        program.programId
      );
      console.log(userForCommentAddress.toString(), "usersforlike");
      const [tweetAta, bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("tweets"),
          // provider.wallet.publicKey.toBuffer(),
          Buffer.from(tweetId),
          Buffer.from(projectName),
        ],
        program.programId
      );

      const [poolAddress] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("pool"),
          clientAddress.toBuffer(),
          mintAddress.toBuffer(),
          Buffer.from(projectName),
        ],
        program.programId
      );

      const [globalAuth, globalBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [Buffer.from("global-authority")],
          // new anchor.BN(id).toArrayLike(Buffer)],
          program.programId
        );
      const prizeTokenAccount = await solConnection.getTokenAccountsByOwner(
        provider.wallet.publicKey,
        { mint: mintAddress }
      );

      // console.log(prizeTokenAccount.value[0].pubkey.toString())

      let associatedTokenAccountPubkey = (
        await PublicKey.findProgramAddress(
          [
            provider.wallet.publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAddress.toBuffer(), // mint address
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )[0];

      console.log(
        associatedTokenAccountPubkey.toString(),
        "associatedTokenAccountPubkey"
      );
      console.log(tweetAta.toString(), bump, "tweetAta");
      console.log(poolAddress.toString(), "poolAddress");
      console.log(
        await solConnection.getMinimumBalanceForRentExemption(336),
        "lamports"
      );

      let instructions = [
        SystemProgram.createAccountWithSeed({
          fromPubkey: provider.wallet.publicKey,
          basePubkey: provider.wallet.publicKey, // clientAddress
          seed: `usersforlike-${tweetId}`,
          newAccountPubkey: userForLikeAddress,
          lamports: await solConnection.getMinimumBalanceForRentExemption(336),
          space: 336,
          programId: program.programId,
        }),
        SystemProgram.createAccountWithSeed({
          fromPubkey: provider.wallet.publicKey,
          basePubkey: provider.wallet.publicKey, // clientAddress
          seed: `usersforretweet-${tweetId}`,
          newAccountPubkey: userForRetweetAddress,
          lamports: await solConnection.getMinimumBalanceForRentExemption(336),
          space: 336,
          programId: program.programId,
        }),
        SystemProgram.createAccountWithSeed({
          fromPubkey: provider.wallet.publicKey,
          basePubkey: provider.wallet.publicKey, // clientAddress
          seed: `usersforcomment-${tweetId}`,
          newAccountPubkey: userForCommentAddress,
          lamports: await solConnection.getMinimumBalanceForRentExemption(336),
          space: 336,
          programId: program.programId,
        }),
      ];

      const tx = await program.rpc.createTweet(
        globalBump,
        projectName,
        tweetId,
        {
          accounts: {
            user: provider.wallet.publicKey,
            client: clientAddress,
            tweetData: tweetAta,
            usersForLike: userForLikeAddress,
            usersForRetweet: userForRetweetAddress,
            usersForComment: userForCommentAddress,
            globalAuthority: globalAuth,
            pool: poolAddress,
            // userAta: prizeTokenAccount.value[0].pubkey,
            poolMint: mintAddress,
            // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
          },
          instructions,
        }
      );
      console.log(tx, "tx");
      return tx;
    } else {
      alert("connect wallet");
    }
  };

  const SubmitForm = async (ev) => {
    try {
      ev.preventDefault();
      if (!clientPublicKey) {
        toast.error("Client publickey is not found");
        return;
      }
      if (!isRaid) {
        toast.error("You can not add the tweet");
        return;
      }
      dispatch({ type: "loadingStart" });

      const { tweetUrl } = stateValues;

      let position = tweetUrl.lastIndexOf("/");
      if (!position) {
        toast.warning("Please enter a valid tweet url");
        navigate(0);
        return;
      }
      var tweetId = tweetUrl.substring(position + 1);
      const res = await axios.get(
        `${process.env.REACT_APP_SERVERURL}/tweet/getTweetById/${tweetId}`
      );
      if (!res?.data?.data) {
        toast.error("No tweet found, Please enter a correct public tweet url");
        dispatch({ type: "loadingStop" });
        return;
      }

      let tx = await createTweet(tweetId);
      if (tx === undefined) {
        dispatch({ type: "loadingStop" });
        return;
      }
      let result = await solConnection.confirmTransaction(tx);
      const body = {
        tweets: {
          tweetUrl,
          tweetId,
          tweetText: res?.data?.data?.text,
        },
      };
      const { data } = await AddInvoicePoolTweetApi(id, body, token);
      dispatch({ type: "loadingStop" });

      if (data.type === "success") {
        toast.success(data.msg);
        navigate(
          `/app/invoice/readOne/readAllPool/readOnePool/readAllTweet/${id}`
        );
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleChange = (e, position) => {
    let temp = [...stateValues.category];
    temp[position] = e.target.value;
    setStateValues((prev) => ({
      ...prev,
      category: temp,
    }));
  };

  return (
    <>
      <div className="container my-5 p-3 border border-1 border-info rounded-3">
        <form className="p-md-3 ">
          <div className="mb-3">
            <label className="form-label">Tweet Url </label>
            <input
              type="text"
              id="tweetUrl"
              placeholder="Url"
              className="form-control"
              value={stateValues.tweetUrl}
              onChange={(e) =>
                setStateValues((prev) => ({
                  ...prev,
                  tweetUrl: e.target.value,
                }))
              }
            />
          </div>

          {/* here btns */}
          <div className="mt-5 mb-3 col">
            {loading && (
              <>
                <MiniSpinner />
              </>
            )}

            <button
              className="btn btn-outline-primary w-100"
              type="button"
              onClick={(ev) => SubmitForm(ev)}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(CreateInvoice);
