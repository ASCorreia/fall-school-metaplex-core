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
const NAME = "MDOCK!";
const URI =
  "https://gist.githubusercontent.com/fribas84/bbc7406d241d4a3d5c027d2a17dea0bf/raw/50ea4ec706bef923bc12abe36dfddcbc9ffff3cb/gistfile1.txt";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────
  //
  // TODO 1: Every Core asset lives at its own fresh address.
  //         Generate a signer for it with generateSigner(umi).
  const asset = generateSigner(umi);
  // TODO 2: Call create(umi, { ... }) with:
  //         - asset, name: NAME, uri: URI
  //         - a `plugins` array containing ONE plugin that makes the
  //           asset frozen forever, with an authority nobody controls.
  //           (Hint: PermanentFreezeDelegate. Which two fields make the
  //           freeze permanent?)
  //         Then .sendAndConfirm(umi)
  //

  await create(umi, {
    asset,
    name: NAME,
    uri: URI,
    plugins: [
      {
        type: "PermanentFreezeDelegate",
        frozen: true,
        authority: { type: "None" },
      },
    ],
  }).sendAndConfirm(umi);

  console.log("\nMinted soulbound NFT!");
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Asset explorer link:", explorerAddress(asset.publicKey.toString()));
  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
