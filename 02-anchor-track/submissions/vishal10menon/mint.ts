/**
 * Mints a soulbound Core NFT from the deployed `soulbound-nft` Anchor
 * program on devnet.
 * Run (from 02-anchor-track/): npx ts-node submissions/vishal10menon/mint.ts
 */
import * as anchor from "@anchor-lang/core";
import { AnchorProvider, Program, Wallet } from "@anchor-lang/core";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import idl from "../../target/idl/soulbound_nft.json";
import type { SoulboundNft } from "../../target/types/soulbound_nft";

const PROGRAM_ID = new PublicKey("JCRtX7ZmvLnyap9PiGTJUgYGRLL5R6TxZ7UXM4F3xtgY");
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

const NAME = "Vishal's Soulbound NFT (Anchor)";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

function loadLocalWallet(): Keypair {
  const keypairPath = path.join(os.homedir(), ".config", "solana", "id.json");
  const secret = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
  return Keypair.fromSecretKey(new Uint8Array(secret));
}

async function main() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const payer = loadLocalWallet();
  const provider = new AnchorProvider(connection, new Wallet(payer), {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const program = new Program(idl as anchor.Idl, provider) as Program<SoulboundNft>;

  // Fresh keypair for the new Core asset (must co-sign creation).
  const asset = Keypair.generate();

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: payer.publicKey,
      asset: asset.publicKey,
      owner: payer.publicKey, // bound to my own wallet, forever
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Program ID:", PROGRAM_ID.toBase58());
  console.log("Asset address:", asset.publicKey.toBase58());
  console.log("Mint transaction:", sig);
  console.log("Asset explorer link:", `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`);
  console.log("Tx explorer link:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
