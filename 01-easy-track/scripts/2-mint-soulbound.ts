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
const NAME = "Laolu";
const URI =
  //"https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";
  "https://gist.githubusercontent.com/Laolu02/03d624006deefaa245c53fef1e85d799/raw/82d41a2b18d8479e7a9d998d5d158e8f49f79483/gistfile1.txt";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────
  //
  // TODO 1: Every Core asset lives at its own fresh address.
  //         Generate a signer for it with generateSigner(umi).
   const mint = generateSigner(umi);
  //
  // TODO 2: Call create(umi, { ... }) with:
  //         - asset, name: NAME, uri: URI
  //         - a `plugins` array containing ONE plugin that makes the
  //           asset frozen forever, with an authority nobody controls.
  //           (Hint: PermanentFreezeDelegate. Which two fields make the
  //           freeze permanent?)
  //         Then .sendAndConfirm(umi)
    await create(umi, {
        asset: mint,
        name: NAME,
        uri: URI,
        plugins: [
          {
            type: "PermanentFreezeDelegate",
            frozen: true,
            authority: { type: "None"},
          },
        ],
    }).sendAndConfirm(umi);
  //
  // TODO 3: Print the asset address and explorerAddress(...) link.
  //
  console.log("Asset address:", mint.publicKey.toString());
  console.log("Explorer:", explorerAddress(mint.publicKey));
  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
