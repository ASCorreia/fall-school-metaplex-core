/**
 * Client mint script for the Anchor track.
 *
 * Calls `mint_soulbound_nft(name, uri)` on the deployed `soulbound_nft`
 * program (devnet), which CPIs into MPL Core `CreateV2` with the
 * PermanentFreezeDelegate plugin (frozen: true, authority: None) — making
 * the resulting Core asset permanently non-transferable.
 *
 * The asset is minted directly to OWNER (a Phantom devnet wallet); the
 * program payer only pays rent + fees.
 *
 * Run: npx tsx submissions/ulukan/mint.ts
 */
import * as anchor from "@anchor-lang/core";
import { Program, AnchorProvider, Wallet } from "@anchor-lang/core";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import fs from "node:fs";
import path from "node:path";

// ── Personalize ──────────────────────────────────────────────────────
const NAME = "Ulukan's Certificate";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";
// The wallet the NFT is permanently bound to (your Phantom devnet address).
const OWNER = new PublicKey("2gJbmwwuQcTgjGvas8k6tureeXnTLEnrgmdKvwZqdTVQ");
// ─────────────────────────────────────────────────────────────────────

const RPC_URL = process.env.RPC_URL ?? "https://api.devnet.solana.com";
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

// Repo paths (this file lives in 02-anchor-track/submissions/ulukan/).
const ROOT = path.resolve(__dirname, "..", "..");
const IDL_PATH = path.join(ROOT, "target", "idl", "soulbound_nft.json");
// Deployer/payer keypair — the funded devnet wallet used for `anchor deploy`.
const PAYER_PATH = path.resolve(
  ROOT,
  "..",
  "01-easy-track",
  "wallet.json"
);

function explorerAddress(a: string) {
  return `https://explorer.solana.com/address/${a}?cluster=devnet`;
}
function explorerTx(s: string) {
  return `https://explorer.solana.com/tx/${s}?cluster=devnet`;
}

async function main() {
  // Load the payer keypair (JSON array of secret-key bytes).
  const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(PAYER_PATH, "utf8")))
  );

  // Anchor provider + program from the generated IDL (program id is
  // embedded in idl.address).
  const connection = new Connection(RPC_URL, "confirmed");
  const wallet = new Wallet(payer);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf8"));
  const program = new Program(idl as anchor.Idl, provider);

  console.log("Program:", program.programId.toBase58());
  console.log("Payer:  ", payer.publicKey.toBase58());
  console.log("Owner:  ", OWNER.toBase58());

  // Every Core asset lives at its own fresh address; the asset keypair
  // must co-sign creation.
  const asset = Keypair.generate();

  const signature = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: wallet.publicKey,
      asset: asset.publicKey,
      owner: OWNER,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("\nMinted soulbound NFT via the on-chain program!");
  console.log("Asset address:", asset.publicKey.toBase58());
  console.log("Asset explorer:", explorerAddress(asset.publicKey.toBase58()));
  console.log("Mint tx:", explorerTx(signature));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
