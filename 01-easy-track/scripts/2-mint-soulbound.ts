/**
 * Step 2 (YOUR TASK): mint a soulbound NFT on devnet.
 * Run: npm run mint
 *
 * Requirements (see README.md):
 *  - Create a Metaplex Core asset on devnet
 *  - Attach the PermanentFreezeDelegate plugin so it can NEVER be transferred
 *  - Print the asset address and its Solana Explorer link
 *
 * Docs: https://www.metaplex.com/docs/smart-contracts/core/guides/create-soulbound-nft-asset
 */
import { generateSigner } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

// Personalize these! NAME should include your name or nickname.
const NAME = "CHANGE ME";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────
  //
  // TODO 1: Every Core asset lives at its own fresh address.
  //         Generate a signer for it with generateSigner(umi).
  //
  // TODO 2: Call create(umi, { ... }) with:
  //         - asset, name: NAME, uri: URI
  //         - a `plugins` array containing ONE plugin that makes the
  //           asset frozen forever, with an authority nobody controls.
  //           (Hint: PermanentFreezeDelegate. Which two fields make the
  //           freeze permanent?)
  //         Then .sendAndConfirm(umi)
  //
  // TODO 3: Print the asset address and explorerAddress(...) link.
  //
  throw new Error("Not implemented yet: replace this with your code!");
  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
