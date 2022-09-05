import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  useWalletModal,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import * as solanaWeb3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  NATIVE_MINT,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Keypair,
} from "@solana/web3.js";

import InvoicePoolFetchDataFunc from "../../../../apis/public/others/InvoicePoolFetchDataFunc";

import Loader from "../../../../helpers/Loader";

import useDispatchFunc from "../../../../hooks/useDispatchFunc";
import useStatesFunc from "../../../../hooks/useStatesFunc";
import IDL from "../../components/twitter_program.json";
import IDLFORRAID from "../../components/twitter_program_for_raid.json";

const ReadOneInvoice = () => {
  const { wallet, connect, sendTransaction, connecting, publicKey } =
    useWallet();
  const { connection } = useConnection();

  const [isRaid, setIsRaid] = useState();

  const [dispatch] = useDispatchFunc();
  const [{ loading }] = useStatesFunc();
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const getinvoiceData = async () => {
      dispatch({ type: "loadingStart" });

      // this is for Details esssential for invoice
      const { data } = await InvoicePoolFetchDataFunc(id);
      setIsRaid(data?.invoiceFound[0]?.isRaid);
      dispatch({ type: "loadingStop" });
      if (data.type === "success") {
        toast.success(data.msg);
      } else {
        toast.warning(data.msg);
        navigate(-1);
      }
    };
    getinvoiceData();
  }, [dispatch, id, navigate]);

  const fundUserPool = async () => {
    const mintAddress = new PublicKey(
      "3pCLx1uK3PVFGQ3siyxurvXXSLijth2prgBEK4cS33XF"
    );
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

      const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("poolAta"),
          provider.wallet.publicKey.toBuffer(),
          mintAddress.toBuffer(),
          Buffer.from(projectName),
        ],
        program.programId
      );

      const clientAta = await solConnection.getTokenAccountsByOwner(
        provider.wallet.publicKey,
        { mint: mintAddress }
      );
      console.log(clientAta.value[0].pubkey.toString(), "clientAta");

      try {
        const tx = await program.rpc.fundUserPool(
          projectName,
          new anchor.BN(amount),
          {
            accounts: {
              client: provider.wallet.publicKey,
              pool: poolAddress,
              poolAta: poolAta,
              poolMint: mintAddress,
              clientAta: clientAta.value[0].pubkey,
              tokenProgram: TOKEN_PROGRAM_ID,
            },
          }
        );
        console.log(tx, "tx");
      } catch (err) {
        console.log(err, "err");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div>
      <div className="border border-1 border-info rounded-3 my-5 container">
        <div className="">
          <div className="display-2 p-3 m-3 text-center text-secondary">
            Pool Info
          </div>
          <div className="d-flex flex-column flex-md-row ms-auto justify-content-evenly align-content-center row p-md-5 py-2 ">
            {isRaid ? (
              <div className="col-8 col-md-6 m-3">
                <button
                  className="btn btn-info border-info text-white w-100 my-2"
                  onClick={() =>
                    navigate(
                      `/app/invoice/readOne/readAllPool/readOnePool/readAllTweet/${id}`
                    )
                  }
                >
                  Tweets
                </button>
              </div>
            ) : null}
            {isRaid ? (
              <div className="col-8 col-md-6 m-3">
                <button
                  className="btn btn-info border-info text-white w-100 my-2"
                  onClick={true}
                >
                  Fund Pool
                </button>
              </div>
            ) : (
              <div className="col-8 col-md-6 m-3">
                <button
                  className="btn btn-info border-info text-white w-100 my-2"
                  onClick={true}
                >
                  Fund Pool
                </button>
              </div>
            )}
            <div className="col-8 col-md-6 m-3">
              <button
                className="btn btn-info border-info text-white w-100 my-2"
                onClick={() =>
                  navigate(`/app/invoice/readOne/readAllPool/update/${id}`)
                }
              >
                Update Pool
              </button>
            </div>
            <div className="col-8 col-md-6 m-3">
              <button
                className="btn btn-info border-info text-white w-100 my-2"
                onClick={() =>
                  navigate(`/app/invoice/readOne/readAllPool/delete/${id}`)
                }
              >
                Delete Pool
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOneInvoice;
