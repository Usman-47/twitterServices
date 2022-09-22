const Wallet = require("../../model/walletModel");
// const CheckRoleAccess = require("../../util/CheckRoleAccess");
// const { encryptFunc } = require("../../util/cryptoFunc");
const { Program, web3 } = require("@project-serum/anchor");
const anchor = require("@project-serum/anchor");
const nacl = require("tweetnacl");

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

// import { Program, web3 } from "@project-serum/anchor";
// import * as anchor from "@project-serum/anchor";
// import {
//     TOKEN_PROGRAM_ID,
//     ASSOCIATED_TOKEN_PROGRAM_ID,
//     NATIVE_MINT,
//     Token,
//   } from "@solana/spl-token";

// twiter-program
// const PROGRAM_ID = new anchor.web3.PublicKey("7k437JyhS6h4d5Uzqc2PzgvpCbj8zep7rmAKtyRNMU1h");
// const idl = JSON.parse(fs.readFileSync(__dirname + "/twitter_program.json", "utf8"));

// raid program
const PROGRAM_ID = new anchor.web3.PublicKey(
  "5UR1VYhWxH9iy5C7mdQWDztgDHLeGZoSyEjye4vzHcjs"
);
const idl = JSON.parse(
  fs.readFileSync(__dirname + "/raid_program.json", "utf8")
);

anchor.setProvider(anchor.Provider.local(web3.clusterApiUrl("devnet")));
// const solConnection = anchor.getProvider().connection;
var solConnection = new web3.Connection(web3.clusterApiUrl("devnet"), {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 120000,
});
const program = new anchor.Program(idl, PROGRAM_ID);

let oldWallet = Keypair.fromSecretKey(
  new Uint8Array([
    190, 159, 62, 11, 223, 105, 148, 57, 187, 238, 45, 245, 134, 232, 118, 39,
    40, 242, 112, 177, 83, 142, 165, 133, 139, 72, 49, 103, 145, 246, 135, 67,
    87, 167, 0, 39, 154, 94, 81, 58, 215, 23, 40, 189, 71, 96, 230, 237, 218,
    168, 97, 22, 225, 178, 244, 52, 201, 152, 93, 198, 153, 22, 159, 33,
  ])
);

// const mintAddress = NATIVE_MINT;
// const mintAddress = new PublicKey(
//   "3pCLx1uK3PVFGQ3siyxurvXXSLijth2prgBEK4cS33XF"
// );
// const projectName = "test-with-api-2";
// const tweetId = "test-id-1";
// const clientAddress = oldWallet.publicKey;

const sleep = async (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

let privateKey = null;
const createWallet = async (req, res) => {
  try {
    const { twitterId } = req.body;

    const newWallet = Keypair.generate();
    console.log(newWallet.publicKey.toString());
    privateKey = newWallet.secretKey.toString();
    console.log(privateKey);
    let newp = privateKey.split(",");
    for (i = 0; i < newp.length; i++) {
      newp[i] = parseInt(newp[i]);
    }
    console.log(newp);
    const secondWallet = Keypair.fromSecretKey(new Uint8Array(newp));
    console.log(secondWallet.publicKey.toString());

    const wallet = new Wallet({
      twitterId,
      publicKey: newWallet.publicKey.toString(),
      privateKey: newWallet.secretKey,
    });
    // await wallet.save()
    res.send({
      msg: "Wallet Created Successfully",
      PublicKey: newWallet.publicKey.toString(),
      type: "success",
    });
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
      msg: "airdrop completed",
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
    let walletObject = await Wallet.findOne({
      accountHolder: mongoose.Types.ObjectId(req.userObj.id),
    });
    if (walletObject) {
      var arrayString = walletObject.privateKey.split(",");
      for (i = 0; i < arrayString.length; i++) {
        arrayString[i] = parseInt(arrayString[i]);
      }
      let oldWallet = Keypair.fromSecretKey(new Uint8Array(arrayString));
      let { funds, startTime, timeLimit, splToken, projectName } = req.body;
      funds = funds * 1000000000;
      const mintAddress = new PublicKey(splToken);
      const blockhashResponse =
        await solConnection.getLatestBlockhashAndContext();
      const lastValidBlockHeight = blockhashResponse.context.slot + 150;
      let blockheight = await solConnection.getBlockHeight();
      // let blockhash = await solConnection.getLatestBlockhash('finalized').blockhash;
      // newTx.recentBlockhash = blockhash;

      console.log(blockhashResponse, "blockhashResponse");
      console.log(lastValidBlockHeight, "lastValidBlockHeight");
      console.log(blockheight, "blockheight");

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

      const newTx = new Transaction();
      newTx.recentBlockhash = blockhashResponse.value.blockhash;

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
            SystemProgram.transfer({
              fromPubkey: oldWallet.publicKey,
              toPubkey: clientAta,
              lamports: funds,
            }),
            Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, clientAta)
          );
          console.log("wrapped");
        }
      } else {
        if (NATIVE_MINT.toString() === mintAddress.toString()) {
          instructions.push(
            SystemProgram.transfer({
              fromPubkey: oldWallet.publicKey,
              toPubkey: clientAta,
              lamports: funds,
            }),
            Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, clientAta)
          );
        }
      }

      console.log(oldWallet.publicKey.toString(), "public key");

      const tx = program.instruction.initializeUserPool(
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
      newTx.feePayer = oldWallet.publicKey;
      if (instructions.length > 0) {
        newTx.add(instructions);
        console.log(instructions, "instruction");
      }
      newTx.add(tx);

      const message = newTx.serializeMessage();
      const signature = nacl.sign.detached(message, oldWallet.secretKey);
      newTx.addSignature(oldWallet.publicKey, Buffer.from(signature));
      const rawTransaction = newTx.serialize();

      let response = "";
      while (blockheight < lastValidBlockHeight) {
        const response = await solConnection.sendTransaction(newTx, [
          oldWallet,
        ]);

        // response = solConnection.sendRawTransaction(rawTransaction, {
        //   skipPreflight: true,
        // });
        // await sleep(500);
        // blockheight = await solConnection.getBlockHeight();
        if (response !== {} || response !== "") {
          res.send({
            msg: "pool created",
            YourWallet: oldWallet.publicKey.toString(),
            tx: response,
            type: "success",
          });
          return;
        }
      }
    } else {
      res.send({
        // msg: "pool created",
        YourWallet: "Wallet Not Found",
        type: "fail",
      });
    }
  } catch (e) {
    console.log(e.message, " err-in raidController");
    res.status(500).send({ msg: e.message, type: "failed" });
  }
};

const createTweet = async (req, res) => {
  try {
    let walletObject = await Wallet.findOne({
      accountHolder: mongoose.Types.ObjectId(req.userObj.id),
    });
    if (walletObject) {
      var arrayString = walletObject.privateKey.split(",");
      for (i = 0; i < arrayString.length; i++) {
        arrayString[i] = parseInt(arrayString[i]);
      }
      let oldWallet = Keypair.fromSecretKey(new Uint8Array(arrayString));
      const clientAddress = oldWallet.publicKey;

      let { tweetId, splToken, projectName } = req.body;

      const mintAddress = new PublicKey(splToken);
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

      const userForLikeAddress = await PublicKey.createWithSeed(
        oldWallet.publicKey,
        `usersforlike-${tweetId}`,
        program.programId
      );
      console.log(userForLikeAddress.toString(), "usersforretweet");
      const userForRetweetAddress = await PublicKey.createWithSeed(
        oldWallet.publicKey,
        `usersforretweet-${tweetId}`,
        program.programId
      );
      console.log(userForRetweetAddress.toString(), "usersforcomment");
      const userForCommentAddress = await PublicKey.createWithSeed(
        oldWallet.publicKey,
        `usersforcomment-${tweetId}`,
        program.programId
      );
      console.log(userForCommentAddress.toString(), "usersforlike");

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

      let instructions = [
        SystemProgram.createAccountWithSeed({
          fromPubkey: oldWallet.publicKey,
          basePubkey: oldWallet.publicKey, // clientAddress
          seed: `usersforlike-${tweetId}`,
          newAccountPubkey: userForLikeAddress,
          lamports: await solConnection.getMinimumBalanceForRentExemption(336),
          space: 336,
          programId: program.programId,
        }),
        SystemProgram.createAccountWithSeed({
          fromPubkey: oldWallet.publicKey,
          basePubkey: oldWallet.publicKey, // clientAddress
          seed: `usersforretweet-${tweetId}`,
          newAccountPubkey: userForRetweetAddress,
          lamports: await solConnection.getMinimumBalanceForRentExemption(336),
          space: 336,
          programId: program.programId,
        }),
        SystemProgram.createAccountWithSeed({
          fromPubkey: oldWallet.publicKey,
          basePubkey: oldWallet.publicKey, // clientAddress
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
            user: oldWallet.publicKey,
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
          signers: [oldWallet],
          instructions,
        }
      );

      res.send({
        msg: "tweet created",
        YourWallet: oldWallet.publicKey.toString(),
        tx: tx,
        type: "success",
      });
    } else {
      res.send({
        YourWallet: "Wallet Not Found",
        type: "fail",
      });
    }
  } catch (e) {
    console.log(e.message, " err-in createUserController");
    res.status(500).send({ msg: e.message, type: "failed" });
  }
};

const tweetAction = async (req, res, number) => {
  try {
    const { userAddress } = req.query;
    console.log(number, userAddress, "user Address");
    const userPublicKey = new PublicKey(userAddress);
    const clientAddress = oldWallet.publicKey;
    const numberOfFollowes = 5000;
    const amount = numberOfFollowes;

    let seed = `usersforlike-${tweetId}`;
    if (number === 1) {
      seed = `usersforlike-${tweetId}`;
    }
    if (number === 2) {
      seed = `usersforretweet-${tweetId}`;
    }
    if (number === 3) {
      seed = `usersforcomment-${tweetId}`;
    }
    // let userForLikeAddress = anchor.web3.Keypair.generate();
    const userForLikeAddress = await PublicKey.createWithSeed(
      clientAddress,
      seed,
      program.programId
    );
    console.log(userForLikeAddress.toString(), "usersforlike");
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

    const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("poolAta"),
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

    let userAta = (
      await PublicKey.findProgramAddress(
        [
          userPublicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintAddress.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )[0];

    console.log(userAta.toString(), "associatedTokenAccountPubkey");
    console.log(tweetAta.toString(), bump, "tweetAta");
    console.log(poolAddress.toString(), "poolAddress");
    console.log(poolAta.toString(), "poolAta");
    console.log(
      await solConnection.getMinimumBalanceForRentExemption(336),
      "lamports"
    );

    // let instructions = [SystemProgram.createAccountWithSeed(
    //   {
    //     fromPubkey: provider.wallet.publicKey,
    //     basePubkey: provider.wallet.publicKey,
    //     seed: tweetValue,
    //     newAccountPubkey: userForLikeAddress,
    //     lamports: await solConnection.getMinimumBalanceForRentExemption(336),
    //     space: 336,
    //     programId: program.programId,
    //   }
    // )]
    const userAtaCheck = await solConnection.getTokenAccountsByOwner(
      userPublicKey,
      { mint: mintAddress }
    );
    let instructions = [];
    if (userAtaCheck.value.length === 0) {
      console.log("2nd condition");
      instructions.push(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mintAddress,
          userAta,
          userPublicKey,
          clientAddress
        )
      );
    }

    if (number === 1) {
      const tx = await program.rpc.likeTweet(
        globalBump,
        projectName,
        tweetId,
        new anchor.BN(amount),
        {
          accounts: {
            user: userPublicKey,
            client: clientAddress,
            // tweetData: tweetAta,
            globalAuthority: globalAuth,
            pool: poolAddress,
            usersForLike: userForLikeAddress,
            poolAta: poolAta,
            userAta: userAta,
            poolMint: mintAddress,
            // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
            // systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            // rent: SYSVAR_RENT_PUBKEY,
          },
          signers: [oldWallet],
          instructions,
        }
      );
      console.log(tx, "tx");
      res.send({
        msg: "tweet liked",
        YourWallet: userPublicKey.toString(),
        tx: tx,
        type: "success",
      });
      return;
    }
    if (number === 2) {
      const tx = await program.rpc.retweet(
        globalBump,
        projectName,
        tweetId,
        new anchor.BN(amount),
        {
          accounts: {
            user: userPublicKey,
            client: clientAddress,
            // tweetData: tweetAta,
            globalAuthority: globalAuth,
            // pool: poolAddress,
            usersForRetweet: userForLikeAddress,
            poolAta: poolAta,
            userAta: userAta,
            poolMint: mintAddress,
            // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
            // systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            // rent: SYSVAR_RENT_PUBKEY,
          },
          signers: [oldWallet],
          instructions,
        }
      );
      console.log(tx, "tx");
      res.send({
        msg: "tweet retweeted",
        YourWallet: userPublicKey.toString(),
        tx: tx,
        type: "success",
      });
      return;
    }
    if (number === 3) {
      const tx = await program.rpc.commentTweet(
        globalBump,
        projectName,
        tweetId,
        new anchor.BN(amount),
        {
          accounts: {
            user: userPublicKey,
            client: clientAddress,
            // tweetData: tweetAta,
            globalAuthority: globalAuth,
            // pool: poolAddress,
            usersForComment: userForLikeAddress,
            poolAta: poolAta,
            userAta: userAta,
            poolMint: mintAddress,
            // poolMint: new PublicKey("So11111111111111111111111111111111111111112"),
            // systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            // rent: SYSVAR_RENT_PUBKEY,
          },
          signers: [oldWallet],
          instructions,
        }
      );
      console.log(tx, "tx");
      res.send({
        msg: "commented on tweet",
        YourWallet: userPublicKey.toString(),
        tx: tx,
        type: "success",
      });
      return;
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
  tweetAction,
};
