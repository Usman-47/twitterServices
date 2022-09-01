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
  var program;
  if (isRaid) {
    program = new anchor.Program(
      IDLFORRAID,
      "5UR1VYhWxH9iy5C7mdQWDztgDHLeGZoSyEjye4vzHcjs",
      provider
    );
  } else {
    program = new anchor.Program(
      IDL,
      "6GfMewRfdC6ArLcg2oNbwq9mfE87UorRYRvGJApbVGrk",
      provider
    );
  }

  const [{ token, loading }] = useStatesFunc();
  const [dispatch] = useDispatchFunc();
  const navigate = useNavigate();
  const [, , checkUserAccess] = useUserFunc();

  const getProjectDetail = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/api/public/invoicePool/${id}`
    );
    if (res?.data?.invoiceFound[0]?.pool) {
      setIsRaid(res?.data?.invoiceFound[0]?.pool);
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

  const initializeUserPool = async () => {
    let limit = 1;
    if (stateValues.rewardFrequency === "week") {
      limit = 7;
    } else if (stateValues.rewardFrequency === "month") {
      limit = 30;
    }
    const mintAddress = new PublicKey(stateValues?.splToken);
    const startTime = stateValues.startTime;
    const timeLimit = limit;
    const funds = stateValues.amount * 1000000000; //
    if (publicKey) {
      const [globalAuth, globalBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [Buffer.from("global-authority")],
          // new anchor.BN(47).toArrayLike(Buffer)],
          program.programId
        );
      console.log(globalAuth.toString(), "globalAuth");

      const [poolAddress] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("pool"),
          provider.wallet.publicKey.toBuffer(),
          mintAddress.toBuffer(),
          Buffer.from(projectName),
        ],
        program.programId
      );
      console.log(poolAddress.toString(), "poolAddress");

      let clientAta = (
        await PublicKey.findProgramAddress(
          [
            provider.wallet.publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAddress.toBuffer(), // mint address
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )[0];

      console.log(clientAta.toString(), "associatedTokenAccountPubkey");
      const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("poolAta"),
          provider.wallet.publicKey.toBuffer(),
          mintAddress.toBuffer(),
          Buffer.from(projectName),
        ],
        program.programId
      );
      console.log(poolAta.toString(), "poolAta");
      const userAtaCheck = await solConnection.getTokenAccountsByOwner(
        provider.wallet.publicKey,
        { mint: mintAddress }
      );

      let instructions = [];
      if (userAtaCheck.value.length === 0) {
        if (NATIVE_MINT.toString() === mintAddress.toString()) {
          instructions.push(
            Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              mintAddress,
              clientAta,
              provider.wallet.publicKey,
              provider.wallet.publicKey
            ),
            // Token.createTransferInstruction(TOKEN_PROGRAM_ID, provider.wallet.publicKey, clientAta, provider.wallet.publicKey, [], 100000000)
            SystemProgram.transfer({
              fromPubkey: provider.wallet.publicKey,
              toPubkey: clientAta,
              lamports: funds,
            }),
            // TOKEN_PROGRAM_ID, provider.wallet.publicKey, clientAta, provider.wallet.publicKey, [], 100000000
            // await Token.createWrappedNativeAccount(solConnection, TOKEN_PROGRAM_ID, provider.wallet.publicKey, provider.wallet, 100000000)
            // ,
            Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, clientAta)
          );
          console.log("wrapped");
        }
      } else {
        if (NATIVE_MINT.toString() === mintAddress.toString()) {
          instructions.push(
            // Token.createTransferInstruction(TOKEN_PROGRAM_ID, provider.wallet.publicKey, clientAta, provider.wallet.publicKey, [], 100000000)
            SystemProgram.transfer({
              fromPubkey: provider.wallet.publicKey,
              toPubkey: clientAta,
              lamports: funds,
            }),
            // TOKEN_PROGRAM_ID, provider.wallet.publicKey, clientAta, provider.wallet.publicKey, [], 100000000
            // await Token.createWrappedNativeAccount(solConnection, TOKEN_PROGRAM_ID, provider.wallet.publicKey, provider.wallet, 100000000)
            // ,
            Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, clientAta)
          );
        }
      }
      try {
        const tx = await program.rpc.initializeUserPool(
          projectName,
          startTime,
          new anchor.BN(timeLimit),
          new anchor.BN(funds),
          {
            accounts: {
              client: provider.wallet.publicKey,
              globalAuthority: globalAuth,
              pool: poolAddress,
              poolAta: poolAta,
              poolMint: mintAddress,
              clientAta: clientAta,
              systemProgram: SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
              rent: SYSVAR_RENT_PUBKEY,
            },
            instructions,
          }
        );
        console.log(tx, "tx");
        return { tx, poolAddress: poolAddress.toString() };
      } catch (err) {
        console.log(err, "err");
      }
    }
  };

  const initializeUserPoolForRaid = async () => {
    let limit = 1;
    if (stateValues.rewardFrequency === "week") {
      limit = 7;
    } else if (stateValues.rewardFrequency === "month") {
      limit = 30;
    }
    // const mintAddress = new PublicKey("3pCLx1uK3PVFGQ3siyxurvXXSLijth2prgBEK4cS33XF");
    const mintAddress = new PublicKey(stateValues?.splToken);
    const startTime = stateValues.startTime;
    const timeLimit = limit;
    const funds = stateValues.amount * 1000000000; // 10 SPL
    if (publicKey) {
      const [globalAuth, globalBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [Buffer.from("global-authority")],
          // new anchor.BN(47).toArrayLike(Buffer)],
          program.programId
        );
      console.log(globalAuth.toString(), "globalAuth");

      const [poolAddress] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("pool"),
          provider.wallet.publicKey.toBuffer(),
          mintAddress.toBuffer(),
          Buffer.from(projectName),
        ],
        program.programId
      );
      console.log(poolAddress.toString(), "poolAddress");

      const [poolSolAddress] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("pool"),
          provider.wallet.publicKey.toBuffer(),
          //  mintAddress.toBuffer(),
          //  Buffer.from(projectName),
        ],
        SystemProgram.programId
      );
      console.log(poolSolAddress.toString(), "poolSolAddress");

      let clientAta = (
        await PublicKey.findProgramAddress(
          [
            provider.wallet.publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAddress.toBuffer(), // mint address
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )[0];
      console.log(mintAddress.toString(), "mint Address");
      console.log(NATIVE_MINT == mintAddress, "Mint native");
      // let temp = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, NATIVE_MINT, provider.wallet.publicKey)
      // console.log(temp.toString(), "temp")

      console.log(clientAta.toString(), "associatedTokenAccountPubkey");
      const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("poolAta"),
          provider.wallet.publicKey.toBuffer(),
          mintAddress.toBuffer(),
          Buffer.from(projectName),
        ],
        program.programId
      );
      // const walletCTemp = Keypair.generate();
      console.log(poolAta.toString(), "poolAta");
      const userAtaCheck = await solConnection.getTokenAccountsByOwner(
        provider.wallet.publicKey,
        { mint: mintAddress }
      );

      let instructions = [];
      if (userAtaCheck.value.length === 0) {
        if (NATIVE_MINT.toString() === mintAddress.toString()) {
          instructions.push(
            Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              mintAddress,
              clientAta,
              provider.wallet.publicKey,
              provider.wallet.publicKey
            ),
            // Token.createTransferInstruction(TOKEN_PROGRAM_ID, provider.wallet.publicKey, clientAta, provider.wallet.publicKey, [], 100000000)
            SystemProgram.transfer({
              fromPubkey: provider.wallet.publicKey,
              toPubkey: clientAta,
              lamports: funds,
            }),
            // TOKEN_PROGRAM_ID, provider.wallet.publicKey, clientAta, provider.wallet.publicKey, [], 100000000
            // await Token.createWrappedNativeAccount(solConnection, TOKEN_PROGRAM_ID, provider.wallet.publicKey, provider.wallet, 100000000)
            // ,
            Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, clientAta)
          );
          console.log("wrapped");
        }
      } else {
        if (NATIVE_MINT.toString() === mintAddress.toString()) {
          instructions.push(
            // Token.createTransferInstruction(TOKEN_PROGRAM_ID, provider.wallet.publicKey, clientAta, provider.wallet.publicKey, [], 100000000)
            SystemProgram.transfer({
              fromPubkey: provider.wallet.publicKey,
              toPubkey: clientAta,
              lamports: funds,
            }),
            // TOKEN_PROGRAM_ID, provider.wallet.publicKey, clientAta, provider.wallet.publicKey, [], 100000000
            // await Token.createWrappedNativeAccount(solConnection, TOKEN_PROGRAM_ID, provider.wallet.publicKey, provider.wallet, 100000000)
            // ,
            Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, clientAta)
          );
          console.log("else");
        }
      }
      try {
        const tx = await program.rpc.initializeUserPool(
          projectName,
          startTime,
          new anchor.BN(timeLimit),
          new anchor.BN(funds),
          {
            accounts: {
              client: provider.wallet.publicKey,
              globalAuthority: globalAuth,
              pool: poolAddress,
              // poolSol: poolSolAddress,
              poolAta: poolAta,
              poolMint: mintAddress,
              clientAta: clientAta,
              systemProgram: SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
              rent: SYSVAR_RENT_PUBKEY,
            },
            instructions,
          }
        );
        console.log(tx, "tx");
        return { tx, poolAddress: poolAddress.toString() };
      } catch (err) {
        console.log(err, "err");
      }
    }
  };

  const SubmitForm = async (ev) => {
    try {
      ev.preventDefault();
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
      /// temporary testing
      var transactionData;
      // if (isRaid) {
      //   transactionData = await initializeUserPoolForRaid();
      //   if (transactionData === undefined) {
      //     dispatch({ type: "loadingStop" });
      //     return;
      //   }
      //   let result = await solConnection.confirmTransaction(transactionData.tx);
      // } else {
      //   transactionData = await initializeUserPool();
      //   if (transactionData === undefined) {
      //     dispatch({ type: "loadingStop" });
      //     return;
      //   }
      //   let result = await solConnection.confirmTransaction(transactionData.tx);
      // }
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
