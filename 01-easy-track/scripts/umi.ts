/**
 * Shared helper: creates a Umi instance connected to Solana devnet,
 * loading (or creating) your workshop wallet from `wallet.json`.
 * You should NOT need to edit this file.
 */
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, Umi } from "@metaplex-foundation/umi";
import { mplCore } from "@metaplex-foundation/mpl-core";
import fs from "node:fs";
import path from "node:path";

export const RPC_URL =
  process.env.RPC_URL ?? "https://api.devnet.solana.com";

const WALLET_PATH = path.join(process.cwd(), "wallet.json");

export function getUmi(): Umi {
  const umi = createUmi(RPC_URL).use(mplCore());

  let secretKey: Uint8Array;
  if (fs.existsSync(WALLET_PATH)) {
    secretKey = new Uint8Array(JSON.parse(fs.readFileSync(WALLET_PATH, "utf8")));
  } else {
    const fresh = generateSigner(umi);
    secretKey = fresh.secretKey;
    fs.writeFileSync(WALLET_PATH, JSON.stringify(Array.from(secretKey)));
    console.log("Created a new devnet wallet at wallet.json");
  }

  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return umi.use(keypairIdentity(keypair));
}

export function explorerAddress(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`;
}

export function explorerTx(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}
