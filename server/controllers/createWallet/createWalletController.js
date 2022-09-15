const mongoose = require("mongoose");
const Wallet = require("../../model/walletModel");
// const CheckRoleAccess = require("../../util/CheckRoleAccess");
// const { encryptFunc } = require("../../util/cryptoFunc");
const { Program, web3 } = require("@project-serum/anchor");
const anchor = require("@project-serum/anchor");
const {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  Token,
} = require("@solana/spl-token");
const {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
  Transaction,
  Keypair,
} = require("@solana/web3.js");
const fs = require("fs");
const CreateInvoiceController = require("../invoice/CreateInvoiceController");

// import { Program, web3 } from "@project-serum/anchor";
// import * as anchor from "@project-serum/anchor";
// import {
//     TOKEN_PROGRAM_ID,
//     ASSOCIATED_TOKEN_PROGRAM_ID,
//     NATIVE_MINT,
//     Token,
//   } from "@solana/spl-token";

const PROGRAM_ID = new anchor.web3.PublicKey(
  "7k437JyhS6h4d5Uzqc2PzgvpCbj8zep7rmAKtyRNMU1h"
);
const idl = JSON.parse(
  fs.readFileSync(__dirname + "/twitter_program.json", "utf8")
);
anchor.setProvider(anchor.Provider.local(web3.clusterApiUrl("devnet")));
const solConnection = anchor.getProvider().connection;
const program = new anchor.Program(idl, PROGRAM_ID);

let oldWallet = Keypair.fromSecretKey(
  new Uint8Array([
    190, 159, 62, 11, 223, 105, 148, 57, 187, 238, 45, 245, 134, 232, 118, 39,
    40, 242, 112, 177, 83, 142, 165, 133, 139, 72, 49, 103, 145, 246, 135, 67,
    87, 167, 0, 39, 154, 94, 81, 58, 215, 23, 40, 189, 71, 96, 230, 237, 218,
    168, 97, 22, 225, 178, 244, 52, 201, 152, 93, 198, 153, 22, 159, 33,
  ])
);

const mintAddress = NATIVE_MINT;
// const mintAddress = new PublicKey("3pCLx1uK3PVFGQ3siyxurvXXSLijth2prgBEK4cS33XF");
const projectName = "test-with-api-2";
const tweetId = "test-id-3";
const clientAddress = oldWallet.publicKey;

const getWallet = async (req, res) => {
  try {
    const { userId } = req.body;

    let wallet = await Wallet.findOne({
      accountHolder: mongoose.Types.ObjectId(userId),
    });
    if (wallet) {
      return res.send({
        msg: "Wallet Found Successfully",
        PublicKey: wallet.publicKey.toString(),
        type: "success",
      });
    } else {
      return res.send({
        msg: "Wallet Not Found",
        type: "fail",
      });
    }
  } catch (e) {
    console.log(e.message, " err-in createUserController");
    res.status(500).send({ msg: e.message, type: "failed" });
  }
};

let privateKey = null;
const createWallet = async (req, res) => {
  try {
    const { userId } = req.body;

    let wallet = await Wallet.findOne({
      accountHolder: mongoose.Types.ObjectId(userId),
    });
    if (!wallet) {
      const newWallet = Keypair.generate();
      console.log(newWallet.publicKey.toString());
      console.log(newWallet.secretKey);
      privateKey = newWallet.secretKey;
      const wallet = new Wallet({
        accountHolder: mongoose.Types.ObjectId(userId),
        publicKey: newWallet.publicKey.toString(),
        privateKey: newWallet.secretKey,
      });
      await wallet.save();
      return res.send({
        msg: "Wallet Created Successfully",
        PublicKey: newWallet.publicKey.toString(),
        type: "success",
      });
    } else {
      return res.send({
        msg: "Wallet Already Exist",
        type: "success",
      });
    }
  } catch (e) {
    console.log(e.message, " err-in createUserController");
    res.status(500).send({ msg: e.message, type: "failed" });
  }
};

const airDrop = async (req, res) => {
  try {
    let tx = new Transaction();

    const userAddress = new PublicKey(req.query.user);
    const users = [
      new PublicKey("HkpkkPnt7jTp9z7otAafYdwkT92QEoCURrM2zVdkcCUn"),
      new PublicKey("CoGobJp3DkjPYT35xKBLiJNDbNoBWjNjpWD6Do1ftfnE"),
      new PublicKey("7VPjjEj7mukgBf9TqpDxivnu7BNH4rdUmSFUpgvpLvf7"),
      new PublicKey("Apex9vESFs3AUhkzMssbRo1Dcx7ysbKHp6WqXQe2ugQV"),
    ];
    console.log(userAddress.toString());

    let clientAta = (
      await PublicKey.findProgramAddress(
        [
          clientAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintAddress.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )[0];

    const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("poolAta"),
        clientAddress.toBuffer(),
        mintAddress.toBuffer(),
        Buffer.from(projectName),
      ],
      program.programId
    );

    for (i = 0; i < users.length; i++) {
      let userAta = (
        await PublicKey.findProgramAddress(
          [
            users[i].toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAddress.toBuffer(), // mint address
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )[0];
      // const [globalAuth, globalBump] = await anchor.web3.PublicKey.findProgramAddress(
      //   [Buffer.from("global-authority")],
      //   // new anchor.BN(47).toArrayLike(Buffer)],
      //   program.programId
      //   );
      //   let tx = await program.methods.bet().transaction();
      tx.feePayer = oldWallet.publicKey;

      const userAtaCheck = await solConnection.getTokenAccountsByOwner(
        users[i],
        { mint: mintAddress }
      );
      // const seed = anchor.utils.sha256.hash([Buffer.from("global-authority"), new anchor.BN(255)])
      // const global = Keypair.fromSeed(seed);
      // console.log(global.publicKey.toString());

      if (userAtaCheck.value.length === 0) {
        console.log(users[i].toString(), "no ata");
        tx.add(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mintAddress,
            userAta,
            users[i],
            oldWallet.publicKey
          )
        );
      }

      tx.add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          poolAta,
          userAta,
          oldWallet.publicKey,
          [oldWallet],
          100_000
        )
      );
    }

    // tx.add(
    //   SystemProgram.transfer({
    //     fromPubkey: oldWallet.publicKey,
    //     toPubkey: new PublicKey("Bx6Z6XxCSdwtqmiKP9prwU7m8NDuUcA11FtPdSZ5Fw9B"),
    //     lamports: 1 * 1000000000,
    //   })
    // );
    //   console.log("tx: ", tx);
    const txID = await solConnection.sendTransaction(tx, [oldWallet]);

    res.send({
      msg: "under development",
      YourWallet: oldWallet.publicKey.toString(),
      tx: txID,
      type: "success",
    });
    // res.send({ msg: "under development", YourWallet: oldWallet.publicKey.toString(), type: "success" });
  } catch (e) {
    console.log(e.message, " err-in createUserController");
    res.status(500).send({ msg: e.message, type: "failed" });
  }
};

const initializeUserPool = async (req, res) => {
  try {
    const startTime = "";
    const timeLimit = 4;
    const funds = 1000_000_000; // 10 SPL

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
        oldWallet.publicKey.toBuffer(),
        mintAddress.toBuffer(),
        Buffer.from(projectName),
      ],
      program.programId
    );
    console.log(poolAddress.toString(), "poolAddress");

    const [poolSolAddress] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("pool"),
        oldWallet.publicKey.toBuffer(),
        //  mintAddress.toBuffer(),
        //  Buffer.from(projectName),
      ],
      SystemProgram.programId
    );
    console.log(poolSolAddress.toString(), "poolSolAddress");

    let clientAta = (
      await PublicKey.findProgramAddress(
        [
          oldWallet.publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintAddress.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )[0];
    console.log(mintAddress.toString(), "mint Address");
    console.log(NATIVE_MINT == mintAddress, "Mint native");
    // let temp = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, NATIVE_MINT, oldWallet.publicKey)
    // console.log(temp.toString(), "temp")

    console.log(clientAta.toString(), "associatedTokenAccountPubkey");
    const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("poolAta"),
        oldWallet.publicKey.toBuffer(),
        mintAddress.toBuffer(),
        Buffer.from(projectName),
      ],
      program.programId
    );
    // const walletCTemp = Keypair.generate();
    console.log(poolAta.toString(), "poolAta");
    const userAtaCheck = await solConnection.getTokenAccountsByOwner(
      oldWallet.publicKey,
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
            oldWallet.publicKey,
            oldWallet.publicKey
          ),
          // Token.createTransferInstruction(TOKEN_PROGRAM_ID, oldWallet.publicKey, clientAta, oldWallet.publicKey, [], 100000000)
          SystemProgram.transfer({
            fromPubkey: oldWallet.publicKey,
            toPubkey: clientAta,
            lamports: funds,
          }),
          // TOKEN_PROGRAM_ID, oldWallet.publicKey, clientAta, oldWallet.publicKey, [], 100000000
          // await Token.createWrappedNativeAccount(solConnection, TOKEN_PROGRAM_ID, oldWallet.publicKey, oldWallet, 100000000)
          // ,
          Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, clientAta)
        );
        console.log("wrapped");
      }
    } else {
      if (NATIVE_MINT.toString() === mintAddress.toString()) {
        instructions.push(
          // Token.createTransferInstruction(TOKEN_PROGRAM_ID, oldWallet.publicKey, clientAta, oldWallet.publicKey, [], 100000000)
          SystemProgram.transfer({
            fromPubkey: oldWallet.publicKey,
            toPubkey: clientAta,
            lamports: funds,
          }),
          // TOKEN_PROGRAM_ID, oldWallet.publicKey, clientAta, oldWallet.publicKey, [], 100000000
          // await Token.createWrappedNativeAccount(solConnection, TOKEN_PROGRAM_ID, oldWallet.publicKey, oldWallet, 100000000)
          // ,
          Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, clientAta)
        );
      }
    }

    // const solTransferTransaction = new Transaction()
    // .add(
    //   SystemProgram.transfer({
    //     fromPubkey: oldWallet.publicKey,
    //     toPubkey: clientAta,
    //     lamports: 1000000000
    //   }),
    //   Token.createSyncNativeInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, clientAta)
    //   )

    //   let blockhash = await solConnection.getLatestBlockhash('finalized').blockhash;
    //   solTransferTransaction.recentBlockhash = blockhash;

    //   await oldWallet.signTransaction(solTransferTransaction)

    console.log(oldWallet.publicKey.toString(), "public key");

    const tx = await program.rpc.initializeUserPool(
      projectName,
      startTime,
      new anchor.BN(timeLimit),
      new anchor.BN(funds),
      {
        accounts: {
          client: oldWallet.publicKey,
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
        signers: [oldWallet],
        instructions,
      }
    );

    res.send({
      msg: "pool created",
      YourWallet: oldWallet.publicKey.toString(),
      tx: tx,
      type: "success",
    });
  } catch (e) {
    console.log(e.message, " err-in createUserController");
    res.status(500).send({ msg: e.message, type: "failed" });
  }
};

const createTweet = async (req, res) => {
  try {
    // const tweetId = tweetValue;

    const [tweetAta, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("tweets"),
        // userAddress.publicKey.toBuffer(),
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
      oldWallet.publicKey,
      { mint: mintAddress }
    );

    // console.log(prizeTokenAccount.value[0].pubkey.toString())

    let associatedTokenAccountPubkey = (
      await PublicKey.findProgramAddress(
        [
          oldWallet.publicKey.toBuffer(),
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

    const tx = await program.rpc.createTweet(globalBump, projectName, tweetId, {
      accounts: {
        user: oldWallet.publicKey,
        client: clientAddress,
        tweetData: tweetAta,
        globalAuthority: globalAuth,
        pool: poolAddress,
        // userAta: prizeTokenAccount.value[0].pubkey,
        poolMint: mintAddress,
        // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers: [oldWallet],
    });

    res.send({
      msg: "tweet created",
      YourWallet: oldWallet.publicKey.toString(),
      tx: tx,
      type: "success",
    });
  } catch (e) {
    console.log(e.message, " err-in createUserController");
    res.status(500).send({ msg: e.message, type: "failed" });
  }
};

const claimReward = async (req, res) => {
  try {
    console.log(req.query.user, "user");
    const userAddress = new PublicKey(req.query.user);
    console.log(userAddress.toString());

    const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("poolAta"),
        clientAddress.toBuffer(),
        mintAddress.toBuffer(),
        Buffer.from(projectName),
      ],
      program.programId
    );
    // console.log(tweetAta.toString(), bump, "tweetAta")
    console.log(poolAta.toString(), "poolAta");

    const [poolAddress] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("pool"),
        clientAddress.toBuffer(),
        mintAddress.toBuffer(),
        Buffer.from(projectName),
      ],
      program.programId
    );
    // console.log(tweetAta.toString(), bump, "tweetAta")
    console.log(poolAddress.toString(), "poolAddress");

    const [poolSolAddress, poolSolBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("pool"),
          clientAddress.toBuffer(),
          //  mintAddress.toBuffer(),
          //  Buffer.from(projectName),
        ],
        SystemProgram.programId
      );
    console.log(poolSolAddress.toString(), "poolSolAddress");

    const userAtaCheck = await solConnection.getTokenAccountsByOwner(
      userAddress,
      { mint: mintAddress }
    );

    // const poolAta = await solConnection.getTokenAccountsByOwner(
    //   new PublicKey("HcS2E6LzvRg4gckiHzuuCzLySAdrjFNFWeifBn8aHi26"),
    //   {mint: mintAddress}
    // );
    //   console.log(poolAta)

    const [globalAuth, globalBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("global-authority")],
        // new anchor.BN(47).toArrayLike(Buffer)],
        program.programId
      );
    console.log(globalAuth.toString(), "globalAuth", globalBump);
    // const globalAta = await solConnection.getTokenAccountsByOwner(
    //   globalAuth,
    //   {mint: mintAddress}
    // );

    let userAta = (
      await PublicKey.findProgramAddress(
        [
          userAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintAddress.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )[0];

    console.log(userAta.toString(), "associatedTokenAccountPubkey");

    // console.log(userAta.value[0].pubkey.toString())
    // globalAta.value.map((item) => {
    //   console.log(item.pubkey.toString())
    // })
    if (userAtaCheck.value.length > 0) {
      const tx = await program.rpc.claimReward(
        new anchor.BN(47),
        new anchor.BN(162),
        globalBump,
        new anchor.BN(5000000),
        {
          accounts: {
            user: userAddress,
            client: clientAddress,
            // tweetData: new PublicKey("FcgCBy6W2tXPM7FVydbkrxQpv14SXjXhSb4kiuBijWVH"),
            globalAuthority: globalAuth,
            // pool: new PublicKey("3HA32nFmRSTGoTZ3Z8wxsBcNQb86cjR1UuG895rJ9zCr"),
            pool: poolAddress,
            // poolSol: poolSolAddress,
            poolAta: poolAta,
            // userAta: userAta.value[0].pubkey,
            userAta: userAta,
            // rewardVault: new PublicKey("FyJWLhuZase1mVpVraRHU6HBav9heHmS1Bu28NckRfSj"),
            // poolAta: poolAta.value[0].pubkey,
            poolMint: mintAddress,
            // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            // rent: SYSVAR_RENT_PUBKEY,
          },
          signers: [oldWallet],
        }
      );
      console.log(tx, "tx");
      res.send({
        msg: "under development",
        YourWallet: oldWallet.publicKey.toString(),
        tx: tx,
        type: "success",
      });
    } else {
      console.log("2nd condition");
      let instructions = [
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mintAddress,
          userAta,
          userAddress,
          oldWallet.publicKey
        ),
      ];

      const tx = await program.rpc.claimRewardInit(
        new anchor.BN(47),
        new anchor.BN(162),
        globalBump,
        projectName,
        new anchor.BN(1_000),
        {
          accounts: {
            user: userAddress,
            client: clientAddress,
            // tweetData: new PublicKey("FcgCBy6W2tXPM7FVydbkrxQpv14SXjXhSb4kiuBijWVH"),
            globalAuthority: globalAuth,
            // pool: new PublicKey("3HA32nFmRSTGoTZ3Z8wxsBcNQb86cjR1UuG895rJ9zCr"),
            pool: poolAddress,
            poolAta: poolAta,
            // userAta: userAta.value[0].pubkey,
            userAta: userAta,
            // rewardVault: new PublicKey("FyJWLhuZase1mVpVraRHU6HBav9heHmS1Bu28NckRfSj"),
            // poolAta: poolAta.value[0].pubkey,
            poolMint: mintAddress,
            // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
          },
          instructions,
          signers: [oldWallet],
        }
      );

      res.send({
        msg: "under development",
        YourWallet: oldWallet.publicKey.toString(),
        tx: tx,
        type: "success",
      });
    }
  } catch (e) {
    console.log(e.message, " err-in createUserController");
    res.status(500).send({ msg: e.message, type: "failed" });
  }
};

module.exports = {
  createWallet,
  airDrop,
  initializeUserPool,
  createTweet,
  claimReward,
  getWallet,
};
