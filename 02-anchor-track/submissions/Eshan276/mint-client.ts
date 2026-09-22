/**
 * Client mint script for the Anchor track.
 *
 * Calls the deployed `soulbound_nft` program on devnet, which CPIs into MPL Core
 * to create an asset carrying a PermanentFreezeDelegate plugin that is frozen
 * from birth with no update authority.
 *
 * Run from `02-anchor-track/`:
 *   npx tsx submissions/Eshan276/mint-client.ts
 *
 * Uses the Solana CLI wallet (~/.config/solana/id.json) as payer, matching the
 * `wallet` entry in Anchor.toml.
 */
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchAsset } from "@metaplex-foundation/mpl-core";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const RPC_URL = process.env.RPC_URL ?? "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("5n5TZSnH61EkY1zUChrXr9UUCQRuuvLoEpX3dCqaMPtc");
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const NAME = "Eshan's Solana Fall School Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

/** Anchor's instruction discriminator: first 8 bytes of sha256("global:<name>"). */
function discriminator(ixName: string): Buffer {
  return crypto.createHash("sha256").update(`global:${ixName}`).digest().subarray(0, 8);
}

/** Borsh `string`: 4-byte little-endian length followed by the UTF-8 bytes. */
function borshString(value: string): Buffer {
  const bytes = Buffer.from(value, "utf8");
  const len = Buffer.alloc(4);
  len.writeUInt32LE(bytes.length);
  return Buffer.concat([len, bytes]);
}

function loadCliWallet(): Keypair {
  const file = path.join(os.homedir(), ".config", "solana", "id.json");
  return Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(file, "utf8"))),
  );
}

async function main() {
  const connection = new Connection(RPC_URL, "confirmed");
  const payer = loadCliWallet();

  // The asset lives at its own fresh address and must co-sign its creation.
  const asset = Keypair.generate();
  // The wallet the NFT is bound to forever. Using the payer here so the diploma
  // belongs to my own wallet.
  const owner = payer.publicKey;

  console.log("Payer:  ", payer.publicKey.toBase58());
  console.log("Asset:  ", asset.publicKey.toBase58());
  console.log("Owner:  ", owner.toBase58());

  const data = Buffer.concat([
    discriminator("mint_soulbound_nft"),
    borshString(NAME),
    borshString(URI),
  ]);

  // Account order must match the `MintSoulboundNft` context in the program.
  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: asset.publicKey, isSigner: true, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: MPL_CORE_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });

  const signature = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(ix),
    [payer, asset],
    { commitment: "confirmed" },
  );

  console.log("\nMinted.");
  console.log("Program: https://explorer.solana.com/address/" + PROGRAM_ID.toBase58() + "?cluster=devnet");
  console.log("Asset:   https://explorer.solana.com/address/" + asset.publicKey.toBase58() + "?cluster=devnet");
  console.log("Tx:      https://explorer.solana.com/tx/" + signature + "?cluster=devnet");

  // Read the asset back and prove it really is soul-bound, rather than assuming
  // a successful transaction means the plugin landed correctly.
  //
  // The transaction above is confirmed but not yet finalized, and umi's RPC
  // defaults to a stricter commitment than that, so poll until the account is
  // visible instead of racing it.
  const umi = createUmi(RPC_URL);
  const assetAddress = publicKey(asset.publicKey.toBase58());
  process.stdout.write("\nWaiting for the asset to finalize");
  for (let i = 0; i < 60; i++) {
    if ((await umi.rpc.getAccount(assetAddress)).exists) break;
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log();

  const fetched = await fetchAsset(umi, assetAddress);
  console.log("\nOn-chain verification:");
  console.log("  name:            ", fetched.name);
  console.log("  owner:           ", fetched.owner.toString());
  console.log("  frozen:          ", fetched.permanentFreezeDelegate?.frozen);
  console.log("  plugin authority:", fetched.permanentFreezeDelegate?.authority.type);

  if (fetched.permanentFreezeDelegate?.frozen !== true) {
    throw new Error("asset is not frozen - it would be transferable");
  }
  if (fetched.permanentFreezeDelegate?.authority.type !== "None") {
    throw new Error("plugin authority is not None - the freeze could be undone");
  }
  console.log("\nSoul-bound confirmed: frozen with no authority to ever thaw it.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
